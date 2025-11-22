import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // <-- Tambah useLocation
import { jwtDecode } from 'jwt-decode';

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // <-- Hook untuk mendeteksi perpindahan halaman

  // Efek ini akan jalan setiap kali "location" (halaman) berubah
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error("Token invalid");
        setUser(null);
      }
    } else {
      setUser(null); // Kalau gak ada token (misal abis logout), set user null
    }
  }, [location]); // <-- KUNCI RAHASIANYA DI SINI

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  // Sembunyikan Navbar kalau user belum login (atau token null)
  if (!user) return null;

  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold">UCP Presensi</h1>
        <Link to="/presensi" className="hover:text-gray-200 font-semibold">Absensi</Link>
        
        {/* Menu Laporan KHUSUS ADMIN */}
        {user.role === 'admin' && (
          <Link to="/reports" className="hover:text-gray-200 font-semibold">Laporan Admin</Link>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium">Halo, {user.nama}</span>
        <button 
          onClick={handleLogout} 
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition duration-200"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;