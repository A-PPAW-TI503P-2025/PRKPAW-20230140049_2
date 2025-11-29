import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
// Import komponen Peta
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// Fix icon marker leaflet yang hilang di React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function PresensiPage() {
  const [user, setUser] = useState({ nama: '', role: '' });
  const [coords, setCoords] = useState(null); // Simpan Lokasi {lat, lng}
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // 1. Ambil User Token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        navigate('/login');
      }
    }
  }, [navigate]);

  // 2. Ambil Lokasi GPS (Geolocation)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          setMessage("Gagal mendapatkan lokasi: " + error.message);
        }
      );
    } else {
      setMessage("Browser tidak mendukung Geolocation.");
    }
  }, []);

  // 3. Fungsi Check-In (Kirim Lokasi ke Backend)
  const handleCheckIn = async () => {
    if (!coords) {
      setMessage("Lokasi belum ditemukan. Tunggu sebentar atau izinkan GPS.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:3001/api/attendance/check-in`,
        {
          latitude: coords.lat,  // Kirim Latitude
          longitude: coords.lng  // Kirim Longitude
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Gagal Check-in');
    }
  };

  const handleCheckOut = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:3001/api/attendance/check-out`,
        {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Gagal Check-out');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10 pb-10">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Presensi Online</h1>
        <p className="mb-4 text-gray-600">Halo, {user.nama} ({user.role})</p>

        {message && (
          <div className={`p-3 rounded mb-4 ${message.includes('Gagal') || message.includes('belum') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        {/* VISUALISASI PETA */}
        {coords ? (
          <div className="mb-6 border-2 border-gray-200 rounded overflow-hidden">
            <MapContainer center={[coords.lat, coords.lng]} zoom={15} style={{ height: '300px', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              <Marker position={[coords.lat, coords.lng]}>
                <Popup>Lokasi Kamu Saat Ini</Popup>
              </Marker>
            </MapContainer>
            <p className="text-xs text-gray-500 mt-1">Lat: {coords.lat}, Lng: {coords.lng}</p>
          </div>
        ) : (
          <p className="mb-6 text-yellow-600 animate-pulse">Sedang mencari lokasi...</p>
        )}

        {/* TOMBOL AKSI */}
        {user.role === 'mahasiswa' && (
          <div className="flex gap-4 justify-center">
            <button onClick={handleCheckIn} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 shadow-lg transition">
              CHECK IN
            </button>
            <button onClick={handleCheckOut} className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 shadow-lg transition">
              CHECK OUT
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PresensiPage;