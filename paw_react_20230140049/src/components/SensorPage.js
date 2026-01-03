import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Registrasi komponen Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function SensorPage() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  // State untuk Kartu Indikator (TUGAS)
  const [latestData, setLatestData] = useState({ suhu: 0, kelembaban: 0, cahaya: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/iot/history');
      const dataSensor = response.data.data;

      // --- 1. SET KARTU INDIKATOR (Ambil data paling terakhir/ujung kanan) ---
      if (dataSensor.length > 0) {
        const last = dataSensor[dataSensor.length - 1];
        setLatestData({
          suhu: last.suhu,
          kelembaban: last.kelembaban,
          cahaya: last.cahaya || 0 // Jaga-jaga kalau null
        });
      }

      // --- 2. SIAPKAN DATA GRAFIK ---
      // Sumbu X: Jam:Menit:Detik
      const labels = dataSensor.map(item => 
        new Date(item.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second:'2-digit' })
      );

      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'Suhu (°C)',
            data: dataSensor.map(item => item.suhu),
            borderColor: 'rgb(255, 99, 132)', // Merah
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            tension: 0.3,
            yAxisID: 'y', // Sumbu Y Kiri
          },
          {
            label: 'Kelembaban (%)',
            data: dataSensor.map(item => item.kelembaban),
            borderColor: 'rgb(53, 162, 235)', // Biru
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            tension: 0.3,
            yAxisID: 'y', // Sumbu Y Kiri
          },
          // --- BAGIAN TUGAS: GRAFIK CAHAYA (LDR) ---
          {
            label: 'Cahaya (Lux)',
            data: dataSensor.map(item => item.cahaya),
            borderColor: 'rgb(255, 205, 86)', // Kuning
            backgroundColor: 'rgba(255, 205, 86, 0.5)',
            tension: 0.3,
            yAxisID: 'y1', // Sumbu Y Kanan (Agar grafik tidak gepeng karena skala beda)
          },
        ],
      });
      setLoading(false);
    } catch (err) {
      console.error("Gagal ambil data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Load awal
    const interval = setInterval(fetchData, 5000); // Auto refresh 5 detik
    return () => clearInterval(interval);
  }, []);

  // Konfigurasi Multi-Axis (Sumbu Y Kiri & Kanan)
  const options = {
    responsive: true,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Grafik Sensor Real-time' },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: 'Suhu & Lembab' }
      },
      y1: { // Sumbu Y kedua untuk Cahaya
        type: 'linear',
        display: true,
        position: 'right',
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'Cahaya' }
      },
    },
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Dashboard Monitoring IoT</h1>

      {/* --- BAGIAN TUGAS: KARTU INDIKATOR --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Kartu Suhu */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Suhu Ruangan</p>
            <p className="text-3xl font-bold text-gray-800">{latestData.suhu}°C</p>
          </div>
          <div className="text-red-500 text-4xl">🌡️</div>
        </div>

        {/* Kartu Kelembaban */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Kelembaban</p>
            <p className="text-3xl font-bold text-gray-800">{latestData.kelembaban}%</p>
          </div>
          <div className="text-blue-500 text-4xl">💧</div>
        </div>

        {/* Kartu Cahaya */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Intensitas Cahaya</p>
            <p className="text-3xl font-bold text-gray-800">{latestData.cahaya}</p>
          </div>
          <div className="text-yellow-500 text-4xl">☀️</div>
        </div>
      </div>

      {/* --- BAGIAN GRAFIK --- */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        {loading ? <p className="text-center">Memuat data grafik...</p> : <Line options={options} data={chartData} />}
      </div>
    </div>
  );
}

export default SensorPage;