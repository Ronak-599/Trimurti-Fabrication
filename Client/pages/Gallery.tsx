// Public gallery page
// Fetch images from GET /api/gallery
// Display images in responsive grid
// Show latest images first
// Handle loading and error states
import React, { useEffect, useState, FormEvent } from 'react';
import { useLocation } from 'react-router-dom';
import './Gallery.css';
import axios from 'axios';
import { fetchGalleryImages, fetchServiceGallery, type GalleryItem } from '../utils/api';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { useTranslation } from 'react-i18next';
const Gallery: React.FC = () => {
    const { t } = useTranslation();
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const serviceParamRaw = params.get('service') || '';
    const serviceKey = params.get('serviceKey') || '';
    const normalize = (s: string) => (s || '').trim().toLowerCase();
    const serviceParam = normalize(serviceParamRaw);
    const [images, setImages] = useState<GalleryItem[]>([]);
    const DISPLAY_LABELS: Record<string, string> = {
        'grill-fabrication': t('services.items.0.title', { defaultValue: 'Grill Fabrication' }),
        'gate-fabrication': t('services.items.1.title', { defaultValue: 'Gate Fabrication' }),
        'shed-fabrication': t('services.items.2.title', { defaultValue: 'Shed Fabrication' }),
        'railing': t('services.items.3.title', { defaultValue: 'Railing & Staircase' }),
        'custom-fabrication': t('services.items.4.title', { defaultValue: 'Custom Fabrication' }),
        'building-work': t('services.items.5.title', { defaultValue: 'Building Work' })
    };
    const displayServiceTitle = serviceParamRaw || DISPLAY_LABELS[serviceKey] || '';
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [service, setService] = useState<string>('');
    const serviceTitles = [
        'Grill Fabrication',
        'Shed Fabrication',
        'Railing & Staircase',
        'Custom Fabrication',
        'Building Work'
    ];
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const load = async () => {
            try {
                const data = serviceKey ? await fetchServiceGallery(serviceKey) : await fetchGalleryImages();
                setImages(data);
            } catch (err) {
                setError(t('gallery.failedLoad', { defaultValue: 'Failed to load images.' }));
            } finally {
                setLoading(false);
            }
        };
        load();
        // re-run when serviceKey changes
    }, [serviceKey]);

    const adminLoggedIn = !!localStorage.getItem('adminToken');

    const sanitizeFilename = (name: string, fallback: string = 'image') => {
        const base = (name || fallback).trim().replace(/[^a-z0-9-_ ]/gi, '').replace(/\s+/g, '-');
        return base || fallback;
    };

    const addCloudinaryAttachment = (url: string, filename?: string) => {
        try {
            const u = new URL(url);
            // Only rewrite for Cloudinary delivery URLs
            if (!/res\.cloudinary\.com/i.test(u.host)) return url;
            const parts = u.pathname.split('/');
            // find the 'upload' segment
            const uploadIdx = parts.findIndex((p) => p === 'upload');
            if (uploadIdx === -1) return url;
            const attach = filename ? `fl_attachment:${sanitizeFilename(filename)}` : 'fl_attachment';
            // Insert attachment transformation just after 'upload'
            parts.splice(uploadIdx + 1, 0, attach);
            u.pathname = parts.join('/');
            return u.toString();
        } catch {
            return url;
        }
    };

    const downloadImage = async (image: GalleryItem) => {
        const filename = sanitizeFilename(image.title || 'image') + '.jpg';
        // First try client-side blob download to avoid navigation
        try {
            const res = await fetch(image.url, { mode: 'cors' });
            if (!res.ok) throw new Error('fetch failed');
            const blob = await res.blob();
            const objectUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = objectUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
            return;
        } catch {
            // Fallback: use Cloudinary attachment transformation to force download
            const attachmentUrl = addCloudinaryAttachment(image.url, filename);
            const a = document.createElement('a');
            a.href = attachmentUrl;
            a.target = '_blank';
            a.rel = 'noopener';
            document.body.appendChild(a);
            a.click();
            a.remove();
        }
    };

    const handleUpload = async (e: FormEvent) => {
        e.preventDefault();
        if (!adminLoggedIn) return;
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        formData.append('title', title);
        formData.append('description', description);
        if (service) formData.append('service', service);
        // removed optional admin-only fields (optionsMarkdown, order)
        try {
            const token = localStorage.getItem('adminToken');
            await axios.post('/api/gallery', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            const refreshed = await fetchGalleryImages();
            setImages(refreshed);
            setTitle('');
            setDescription('');
            setFile(null);
        } catch (err) {
            setError('Failed to upload image.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!adminLoggedIn) return;
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`/api/gallery/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const refreshed = await fetchGalleryImages();
            setImages(refreshed);
        } catch (err) {
            setError('Failed to delete image.');
        }
    };
    if (loading) {
        return <div>{t('common.loading', { defaultValue: 'Loading...' })}</div>;
    }
    if (error) {
        return <div>{error}</div>;
    }
    // Choose which images to display based on optional service filter
    const displayImages = serviceParam ? images.filter((img) => normalize(img.service || '') === serviceParam) : images;
    // Build options markdown list for filtered service
    const serviceOptions = serviceParam
        ? images.filter((img) => normalize(img.service || '') === serviceParam && !!(img.optionsMarkdown || '').trim())
        : [];

    return (
        <div>
            <div className="bg-slate-900 py-20 text-center">
                <h1 className="text-4xl font-bold text-white uppercase tracking-widest">{t('gallery.header.title', { defaultValue: 'Gallery' })}</h1>
                <p className="text-slate-400 mt-4">{t('gallery.header.subtitle', { defaultValue: 'Explore our recent projects and designs.' })}</p>
            </div>
            <div className="gallery-container">
            {serviceParamRaw ? (
                <div style={{ padding: '12px 16px' }}>
                    <h2 style={{ fontWeight: 700, color: '#0f172a' }}>{t('gallery.serviceLabel', { defaultValue: 'Service:' })} {serviceParamRaw}</h2>
                    {serviceOptions.length ? (
                        <div style={{ marginTop: 8 }}>
                            <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.2, color: '#64748b', fontWeight: 600 }}>{t('gallery.optionsLabel', { defaultValue: 'Options' })}</div>
                            <div style={{ display: 'grid', gap: 8, marginTop: 6 }}>
                                {serviceOptions.map((g) => {
                                    const markdownHtml = marked.parse(g.optionsMarkdown || '', { async: false }) as string;
                                    const html = DOMPurify.sanitize(markdownHtml) as string;
                                    return (
                                        <div key={g.id} className="text-slate-700 text-sm" dangerouslySetInnerHTML={{ __html: html }} />
                                    );
                                })}
                            </div>
                        </div>
                    ) : null}
                </div>
            ) : null}
            {adminLoggedIn && !serviceKey ? (
                <form onSubmit={handleUpload} className="upload-form">
                    <input 
                        type="text"
                        placeholder={t('gallery.form.title', { defaultValue: 'Title' })}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder={t('gallery.form.description', { defaultValue: 'Description (optional)' })}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                    >
                        <option value="">{t('gallery.form.selectService', { defaultValue: 'Select Service (optional)' })}</option>
                        {serviceTitles.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {/* Options (Markdown) and Display Order inputs removed per request */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const files = e.currentTarget.files;
                            setFile(files && files.length ? files[0] : null);
                        }}
                        required
                    />
                    <button type="submit">{t('gallery.form.upload', { defaultValue: 'Upload' })}</button>
                </form>
            ) : null}
            <div className="gallery-grid">
                {displayImages.map((image) => (
                    <div key={image.id} className="gallery-item">
                        <img
                            src={image.url}
                            alt={image.title}
                            className="gallery-image"
                            onClick={() => downloadImage(image)}
                            style={{ cursor: 'pointer' }}
                        />
                        <h3>{image.title}</h3>
                        {image.description ? <p>{image.description}</p> : null}
                        {adminLoggedIn ? (
                            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 15px 12px' }}>
                                <button onClick={() => handleDelete(image.id)} className="delete-button">{t('common.delete', { defaultValue: 'Delete' })}</button>
                            </div>
                        ) : null}
                    </div>
                ))}
            </div>
            </div>
        </div>
    );
};

export default Gallery;