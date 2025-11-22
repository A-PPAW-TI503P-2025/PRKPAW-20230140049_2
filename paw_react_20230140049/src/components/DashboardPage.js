import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Library untuk baca isi token
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const [user, setUser] = useState({ nama: 'User' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // 1. Saat halaman dibuka, ambil data user dari Token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Kalau gak ada token, tendang ke login
    } else {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded); // Simpan data user (nama, id, role) ke state
      } catch (error) {
        console.error("Token error:", error);
        navigate('/login');
      }
    }
  }, [navigate]);

  // 2. Fungsi Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // 3. Fungsi Absen (Check-in / Check-out)
  const handleAbsensi = async (type) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = type === 'in' ? 'check-in' : 'check-out';
      
      // Kirim Request ke Backend dengan Token di Header
      const response = await axios.post(
        `http://localhost:3001/api/attendance/${endpoint}`,
        {}, // Body kosong
        {
          headers: { Authorization: `Bearer ${token}` } // <-- INI KUNCINYA
        }
      );

      setMessage(response.data.message); // Tampilkan pesan sukses dari backend
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Terjadi kesalahan');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Halo, {user.nama}!</h1>
        <p className="text-gray-600 mb-6">Role: {user.role}</p>

        {/* Area Pesan Status */}
        {message && (
          <div className={`p-3 rounded mb-6 ${message.includes('berhasil') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        {/* Tombol Aksi */}
        <div className="flex gap-4 justify-center mb-8">
          <button 
            onClick={() => handleAbsensi('in')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition"
          >
            CHECK IN
          </button>
          <button 
            onClick={() => handleAbsensi('out')}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded transition"
          >
            CHECK OUT
          </button>
        </div>

        <button onClick={handleLogout} className="text-red-500 underline hover:text-red-700">
          Logout
        </button>
      </div>
    </div>
  );
}

export default DashboardPage;