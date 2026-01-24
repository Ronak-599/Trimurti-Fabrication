
/**
 * Shared API configuration for the MERN stack frontend.
 * Uses a relative base so Vite dev server can proxy to the backend.
 */
export const API_BASE_URL = '/api';

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  description?: string;
  uploadedAt?: string;
  service?: string;
  optionsMarkdown?: string;
  order?: number | null;
}

// Reviews
export interface ReviewItem {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

export const submitContactForm = async (data: any) => {
  const response = await fetch(`${API_BASE_URL}/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to submit message. Please try again later.');
  }

  return response.json();
};

// Fetch all gallery images from backend
export const fetchGalleryImages = async (): Promise<GalleryItem[]> => {
  const response = await fetch(`${API_BASE_URL}/gallery`);
  if (!response.ok) {
    throw new Error('Failed to fetch gallery images.');
  }
  const data = await response.json();
  const list = Array.isArray(data) ? data : (data.galleryImages ?? []);
  // Normalize server payload to client shape
  return list.map((item: any) => ({
    id: item.id ?? item._id ?? String(item.imageUrl ?? Math.random()),
    url: item.url ?? item.imageUrl,
    title: item.title ?? '',
    description: item.description ?? '',
    uploadedAt: item.createdAt ?? item.uploadedAt,
    service: item.service ?? '',
    optionsMarkdown: item.optionsMarkdown ?? '',
    order: (typeof item.order === 'number') ? item.order : (item.order ? Number(item.order) : null),
  }));
}

// Fetch gallery images for a specific service/collection key
export const fetchServiceGallery = async (key: string): Promise<GalleryItem[]> => {
  const response = await fetch(`${API_BASE_URL}/gallery/service/${encodeURIComponent(key)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch service gallery.');
  }
  const data = await response.json();
  const list = Array.isArray(data) ? data : (data.galleryImages ?? []);
  return list.map((item: any) => ({
    id: item.id ?? item._id ?? String(item.imageUrl ?? Math.random()),
    url: item.url ?? item.imageUrl,
    title: item.title ?? '',
    description: item.description ?? '',
    uploadedAt: item.createdAt ?? item.uploadedAt,
    service: item.service ?? '',
    optionsMarkdown: item.optionsMarkdown ?? '',
    order: (typeof item.order === 'number') ? item.order : (item.order ? Number(item.order) : null),
  }));
}

// Fetch all reviews
export const fetchReviews = async (): Promise<ReviewItem[]> => {
  const res = await fetch(`${API_BASE_URL}/reviews`);
  if (!res.ok) throw new Error('Failed to fetch reviews');
  const data = await res.json();
  const list = Array.isArray(data) ? data : (data.reviews ?? []);
  return list.map((r: any) => ({
    id: r._id ?? r.id,
    name: r.name,
    rating: Number(r.rating),
    comment: r.comment,
    createdAt: r.createdAt,
  }));
}

// Submit a review (public)
export const submitReview = async (name: string, rating: number, comment: string): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, rating, comment }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to submit review');
  }
}

// Delete a review (admin only)
export const deleteReview = async (id: string): Promise<void> => {
  const token = localStorage.getItem('adminToken');
  const res = await fetch(`${API_BASE_URL}/reviews/${id}`, {
    method: 'DELETE',
    headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to delete review');
  }
}

// Admin login API
// Send email and password to POST /api/admin/login
// Return JWT token
export const adminLogin = async (email: string, password: string): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Invalid email or password');
  }

  const data = await response.json();
  return data.token; // Assuming the token is returned in { token: '...' }
}