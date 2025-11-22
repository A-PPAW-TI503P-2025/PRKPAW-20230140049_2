import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function PresensiPage() {
  // State untuk menyimpan data user dan pesan status
  const [user, setUser] = useState({ nama: '', role: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // 1. Ambil data User dari Token saat halaman dibuka
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect ke login jika tidak ada token
    } else {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded); // Simpan data (nama, role, id) ke state
      } catch (error) {
        console.error("Token invalid", error);
        navigate('/login');
      }
    }
  }, [navigate]);

  // 2. Fungsi untuk mengirim request Absen ke Backend
  const handleAbsensi = async (type) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = type === 'in' ? 'check-in' : 'check-out';
      
      // Kirim request ke port 3001 (Backend)
      const response = await axios.post(
        `http://localhost:3001/api/attendance/${endpoint}`,
        {}, // Body kosong
        {
          headers: { Authorization: `Bearer ${token}` } // Wajib bawa token!
        }
      );

      setMessage(response.data.message); // Tampilkan pesan sukses
    } catch (error) {
      // Tampilkan pesan error dari backend (misal: "Sudah check-in")
      setMessage(error.response ? error.response.data.message : 'Terjadi kesalahan');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Aplikasi Absensi</h1>
        <h2 className="text-lg mb-6 text-gray-600">Halo, {user.nama}!</h2>

        {/* Area Menampilkan Pesan Sukses/Error */}
        {message && (
          <div className={`p-3 rounded mb-6 ${message.toLowerCase().includes('berhasil') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        {/* --- LOGIKA PEMISAHAN TAMPILAN (UI) --- */}
        
        {user.role === 'mahasiswa' ? (
          // TAMPILAN 1: KHUSUS MAHASISWA (Ada Tombol)
          <div className="flex gap-4 justify-center mb-8">
            <button 
              onClick={() => handleAbsensi('in')} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition shadow-lg"
            >
              CHECK IN
            </button>
            <button 
              onClick={() => handleAbsensi('out')} 
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded transition shadow-lg"
            >
              CHECK OUT
            </button>
          </div>
        ) : (
          // TAMPILAN 2: KHUSUS ADMIN (Hanya Pesan)
          <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
            <p className="font-bold text-lg mb-2">Mode Admin</p>
            <p className="text-sm">Anda masuk sebagai Administrator.</p>
            <p className="text-sm mt-1">
              Silakan akses menu <strong>Laporan Admin</strong> di navbar atas untuk melihat rekap presensi.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default PresensiPage;