import React from 'react';
import $ from 'jquery';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import LoginPage from './pages/Login-Register/LoginPage';
import RegisterPage from './pages/Login-Register/RegisterPage';
import ConfirmRegisterPage from './pages/Login-Register/ConfirmRegisterPage';
import Homepage from "./pages/Home-View/Homepage";
import SystemPage from './pages/System/SystemPage';
import BenchmarkPage from './pages/Benchmark/BenchmarkPage';
import UploadPage from './pages/Upload/UploadPage';

function App() {

  return (
    <Router >
      <Routes>
        <Route path="/" element={<LoginPage />} exact />

        <Route path="/register" element={<RegisterPage />} exact />

        <Route path="/confirmRegister" element={<ConfirmRegisterPage />} exact />

        <Route path="/homepage" element={<Homepage />} exact />

        <Route path="/system" element={<SystemPage />} exact />

        <Route path="/benchmark" element={<BenchmarkPage />} exact />

        <Route path="/upload" element={<UploadPage />} exact />
      </Routes>  
    </Router>
  );
}

export default App;
