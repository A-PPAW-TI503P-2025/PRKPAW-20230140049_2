import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ReportPage() {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
    else fetchReports(token);
  }, [navigate]);

  const fetchReports = async (token) => {
    try {
      const response = await axios.get('http://localhost:3001/api/reports/daily', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Data Laporan:", response.data.data); // Cek di Console Browser
      setReports(response.data.data);
    } catch (error) {
      console.error("Gagal ambil data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="bg-white p-8 rounded shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Laporan Presensi (Admin)</h1>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Lokasi (Lat, Lng)</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Check-In</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Check-Out</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((item) => (
                <tr key={item.id}>
                  {/* PENTING: Gunakan item.user (kecil) sesuai alias Modul 9 */}
                  <td className="px-6 py-4 font-medium">
                    {item.user ? item.user.nama : 'User Tidak Dikenal'}
                  </td>
                  
                  {/* Tambahan: Menampilkan Lokasi (Modul 9) */}
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {item.latitude && item.longitude ? 
                      `${item.latitude}, ${item.longitude}` : 
                      '-'}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(item.checkIn).toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.checkOut ? new Date(item.checkOut).toLocaleString("id-ID") : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {reports.length === 0 && (
            <p className="text-center p-4 text-gray-500">Belum ada data presensi.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReportPage;