import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('mahasiswa'); // Default role
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Kirim data ke Backend (Port 3001)
      await axios.post('http://localhost:3001/api/auth/register', {
        nama: nama,
        email: email,
        password: password,
        role: role
      });

      alert('Registrasi Berhasil! Silakan Login.');
      navigate('/login'); // Pindah ke halaman login

    } catch (err) {
      setError(err.response ? err.response.data.message : 'Registrasi gagal');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Daftar Akun</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Nama Lengkap</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="mahasiswa">Mahasiswa</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
            Daftar
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;