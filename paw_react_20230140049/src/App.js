import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. Pastikan Navbar di-import
import Navbar from './components/Navbar'; 
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import PresensiPage from './components/PresensiPage';
import ReportPage from './components/ReportPage';
import SensorPage from './components/SensorPage';

function App() {
  return (
    <Router>
      {/* 2. PASANG NAVBAR DISINI (Di dalam Router, tapi di atas Routes) */}
      <Navbar /> 
      
      <div className="container mx-auto mt-4">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Route Halaman Utama */}
          <Route path="/presensi" element={<PresensiPage />} />
          <Route path="/reports" element={<ReportPage />} />
          <Route path="/monitoring" element={<SensorPage />} />
          
          {/* Default */}
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;