import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // <-- Tambah Import Link

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email: email,
        password: password
      });

      const token = response.data.token;
      localStorage.setItem('token', token);
      navigate('/presensi'); // Pindah ke halaman presensi setelah login
      
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Login gagal');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Silakan Login</h2>
        
        {error && <p className="text-red-500 text-center mb-4 bg-red-100 p-2 rounded">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-semibold">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200">
            Masuk
          </button>
        </form>

        {/* --- TAMBAHAN LINK REGISTER --- */}
        <div className="mt-4 text-center text-sm">
          <p className="text-gray-600">
            Belum punya akun?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-bold">
              Daftar di sini
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;