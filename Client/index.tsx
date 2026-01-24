import './i18n';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Route for gallery page
import Gallery from './pages/Gallery';
import { Route } from 'react-router-dom';

// Add route in your App component or routing configuration
<Route path="/gallery" element={<Gallery />} />

// Protect admin gallery route using token check
import AdminGallery from './pages/AdminGallery';
// Add route in your App component or routing configuration
<Route path="/admin/gallery" element={<AdminGallery />} />

// Import i18n configuration to enable multi-language support
// Ensure this import is at the top level of your application, such as in index.tsx or App.tsx