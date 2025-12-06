import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam'; // Import Webcam
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon, shadowUrl: iconShadow,
    iconSize: [25, 41], iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function PresensiPage() {
  const [user, setUser] = useState({ nama: '', role: '' });
  const [coords, setCoords] = useState(null);
  const [image, setImage] = useState(null); // State untuk simpan hasil foto
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const webcamRef = useRef(null); // Ref untuk akses kamera

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
    else {
      try { setUser(jwtDecode(token)); } catch (e) { navigate('/login'); }
    }
  }, [navigate]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => setMessage("Gagal ambil lokasi: " + err.message)
      );
    }
  }, []);

  // Fungsi Ambil Foto (Capture)
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  // Fungsi Kirim Data (Check-In)
  const handleCheckIn = async () => {
    if (!coords || !image) {
      setMessage("Lokasi dan Foto wajib ada!");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      // Ubah base64 image jadi Blob agar bisa dikirim sebagai file
      const blob = await (await fetch(image)).blob();

      // Gunakan FormData untuk kirim file + data teks
      const formData = new FormData();
      formData.append('latitude', coords.lat);
      formData.append('longitude', coords.lng);
      formData.append('image', blob, 'selfie.jpg'); // Nama file di server

      const response = await axios.post(
        'http://localhost:3001/api/attendance/check-in',
        formData, // Kirim FormData, bukan JSON biasa
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Gagal Check-in');
    }
  };

  const handleCheckOut = async () => {
    // CheckOut tidak butuh foto, jadi code lama aman
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3001/api/attendance/check-out', {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Gagal');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10 pb-10">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Presensi Selfie</h1>
        <p className="mb-4 text-gray-600">Halo, {user.nama}</p>

        {message && <div className={`p-3 rounded mb-4 ${message.includes('Gagal') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{message}</div>}

        {/* 1. MAPS */}
        {coords ? (
            <div className="mb-4 h-48 w-full border rounded overflow-hidden">
                <MapContainer center={[coords.lat, coords.lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[coords.lat, coords.lng]}><Popup>Kamu di sini</Popup></Marker>
                </MapContainer>
            </div>
        ) : <p>Mencari Lokasi...</p>}

        {/* 2. KAMERA / HASIL FOTO */}
        <div className="mb-4 border rounded overflow-hidden bg-black">
            {image ? (
                <img src={image} alt="Selfie" className="w-full" />
            ) : (
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full"
                />
            )}
        </div>

        {/* 3. TOMBOL AKSI */}
        {user.role === 'mahasiswa' && (
            <div className="flex flex-col gap-3">
                {!image ? (
                    <button onClick={capture} className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Ambil Foto 📸</button>
                ) : (
                    <button onClick={() => setImage(null)} className="bg-gray-500 text-white py-2 rounded hover:bg-gray-600">Foto Ulang 🔄</button>
                )}

                <div className="flex gap-2 justify-center mt-2">
                    <button onClick={handleCheckIn} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 w-1/2">CHECK IN</button>
                    <button onClick={handleCheckOut} className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 w-1/2">CHECK OUT</button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}

export default PresensiPage;