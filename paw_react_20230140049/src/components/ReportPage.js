import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ReportPage() {
  const [reports, setReports] = useState([]);
  // State untuk Modal Popup
  const [selectedImage, setSelectedImage] = useState(null); 
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
      setReports(response.data.data);
    } catch (error) {
      console.error("Gagal ambil data:", error);
    }
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="bg-white p-8 rounded shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Laporan Presensi + Foto</h1>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-bold text-gray-500">Nama</th>
                <th className="px-6 py-3 text-left font-bold text-gray-500">Bukti Foto</th>
                <th className="px-6 py-3 text-left font-bold text-gray-500">Lokasi</th>
                <th className="px-6 py-3 text-left font-bold text-gray-500">Check-In</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4">{item.user ? item.user.nama : '-'}</td>
                  
                  {/* KOLOM BUKTI FOTO */}
                  <td className="px-6 py-4">
                    {item.buktiFoto ? (
                      <img 
                        src={`http://localhost:3001/${item.buktiFoto}`} 
                        alt="Bukti" 
                        className="h-16 w-16 object-cover rounded border cursor-pointer hover:opacity-80 transition"
                        // Saat diklik, simpan URL gambar ke state selectedImage
                        onClick={() => setSelectedImage(`http://localhost:3001/${item.buktiFoto}`)}
                      />
                    ) : <span className="text-gray-400 text-sm">No Photo</span>}
                  </td>

                  <td className="px-6 py-4 text-xs text-gray-500">
                    {item.latitude && item.longitude ? 
                      `${item.latitude}, ${item.longitude}` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(item.checkIn).toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL POPUP --- */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeModal} // Klik background untuk tutup
        >
          <div className="bg-white p-2 rounded-lg max-w-3xl max-h-full overflow-auto relative">
            <button 
              onClick={closeModal}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 w-8 h-8 flex items-center justify-center font-bold"
            >
              X
            </button>
            <img 
              src={selectedImage} 
              alt="Full Size" 
              className="max-w-full max-h-[80vh] object-contain rounded"
            />
          </div>
        </div>
      )}

    </div>
  );
}

export default ReportPage;