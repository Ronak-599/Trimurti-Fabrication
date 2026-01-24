
import React from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ContactPage from './pages/ContactPage';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import AdminGallery from './pages/AdminGallery';
import Gallery from './pages/Gallery';
import AdminLogin from "./pages/AdminLogin";


const isAdminLoggedIn = () => {
  return !!localStorage.getItem("adminToken");
};
  
const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/gallery"
              element={
                isAdminLoggedIn() ? <AdminGallery /> : <Navigate to="/admin/login" />
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
// // Protect admin gallery route using token check
// import AdminGallery from './pages/AdminGallery';
// // Add route in your App component or routing configuration
// <Route path="/admin/gallery" element={<AdminGallery />} />