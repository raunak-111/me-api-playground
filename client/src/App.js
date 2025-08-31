import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import Navbar from './components/Layout/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Projects from './pages/Projects';
import Skills from './pages/Skills';
import Search from './pages/Search';
import Login from './pages/Login';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Container maxWidth="xl" className="py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/search" element={<Search />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Container>
      </div>
    </AuthProvider>
  );
}

export default App;
