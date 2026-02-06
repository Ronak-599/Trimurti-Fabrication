/**
 * Shared API configuration for the MERN stack frontend.
 * In dev, use relative `/api` so Vite proxies to localhost.
 * In production (e.g., Vercel), set `VITE_API_BASE_URL` to your backend URL.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || '/api';

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

// Fetch all gallery images from backend
export const fetchGalleryImages = async (): Promise<GalleryItem[]> => {
  const response = await fetch(`${API_BASE_URL}/gallery`);
  if (!response.ok) {
    throw new Error('Failed to fetch gallery images.');
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
    order: typeof item.order === 'number'
      ? item.order
      : item.order
      ? Number(item.order)
      : null,
  }));
};

// Fetch gallery images for a specific service
export const fetchServiceGallery = async (key: string): Promise<GalleryItem[]> => {
  const response = await fetch(
    `${API_BASE_URL}/gallery/service/${encodeURIComponent(key)}`
  );
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
    order: typeof item.order === 'number'
      ? item.order
      : item.order
      ? Number(item.order)
      : null,
  }));
};

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
};

// Submit a review
export const submitReview = async (
  name: string,
  rating: number,
  comment: string
): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, rating, comment }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to submit review');
  }
};

// Delete a review (admin)
export const deleteReview = async (id: string): Promise<void> => {
  const token = localStorage.getItem('adminToken');
  const res = await fetch(`${API_BASE_URL}/reviews/${id}`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to delete review');
  }
};

// Admin login
export const adminLogin = async (
  email: string,
  password: string
): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Invalid email or password');
  }

  const data = await response.json();
  return data.token;
};
