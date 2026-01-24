// Admin gallery page
// Upload new gallery image using POST /api/gallery
// Send JWT token in Authorization header
// Display existing images with delete option
import React, { useEffect, useState, FormEvent } from 'react';
import axios from 'axios';
import './AdminGallery.css';
import { fetchGalleryImages, type GalleryItem } from '../utils/api';
type Image = GalleryItem;
const AdminGallery: React.FC = () => {
    const [images, setImages] = useState<Image[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [service, setService] = useState<string>('');
    const [optionsMarkdown, setOptionsMarkdown] = useState<string>('');
    const [order, setOrder] = useState<string>('');
    // Keep service list aligned with Services page titles
    const serviceTitles = [
        'CNC Machining',
        'Laser & Plasma Cutting',
        'Certified Welding',
        'Sheet Metal Fabrication',
        'Surface Finishing',
        'Engineering Design'
    ];
    const fetchImages = async () => {
        try {
            const data = await fetchGalleryImages();
            setImages(data);
        } catch (err) {
            setError('Failed to load images.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []); 
    const handleUpload = async (e: FormEvent) => {
        e.preventDefault();
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        formData.append('title', title);
        formData.append('description', description);
        if (service) formData.append('service', service);
        if (optionsMarkdown) formData.append('optionsMarkdown', optionsMarkdown);
        if (order) formData.append('order', order);
        try {
            const token = localStorage.getItem('adminToken');
            await axios.post('/api/gallery', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            await fetchImages();
        } catch (err) {
            setError('Failed to upload image.');
        }
    };
    const handleDelete = async (id: string) => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`/api/gallery/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchImages();
        } catch (err) {
            setError('Failed to delete image.');
        }
    };
    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error: {error}</div>;
    }
    return (
        <div className="admin-gallery-container">
            <h2>Admin Gallery</h2>
            <form onSubmit={handleUpload} className="upload-form">
                <input 
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                >
                    <option value="">Select Service (optional)</option>
                    {serviceTitles.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                    required
                />
                <button type="submit">Upload</button>
            </form>
            <div className="gallery-images">
                {images.map((image) => (
                    <div key={image.id} className="gallery-image">
                        <img src={image.url} alt={image.title} />
                        <h3>{image.title}</h3>
                        <p>{image.description}</p>
                        <button onClick={() => handleDelete(image.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminGallery;