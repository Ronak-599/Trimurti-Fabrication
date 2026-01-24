
import React, { useEffect, useMemo, useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchReviews, submitReview, deleteReview, type ReviewItem, fetchGalleryImages, type GalleryItem } from '../utils/api';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { useTranslation } from 'react-i18next';

const Services: React.FC = () => {
  const { t } = useTranslation();
  const services = [
    {
      title: t('services.items.0.title', { defaultValue: 'Grill Fabrication' }),
      desc: t('services.items.0.desc', { defaultValue: 'Strong, safe, and attractive iron grills for homes, shops, and compounds.' }),
      img: "/griling.jpeg"
    },
    {
      title: t('services.items.1.title', { defaultValue: 'Gate Fabrication' }),
      desc: t('services.items.1.desc', { defaultValue: 'Main gates, sliding gates, and iron doors built with precise measurements and durable construction.' }),
      img: "/gate.jpeg"
    },
    {
      title: t('services.items.2.title', { defaultValue: 'Shed Fabrication' }),
      desc: t('services.items.2.desc', { defaultValue: 'Robust iron sheds for industrial, commercial, and household use.' }),
      img: "/shed.jpeg"
    },
    {
      title: t('services.items.3.title', { defaultValue: 'Railing & Staircase' }),
      desc: t('services.items.3.desc', { defaultValue: 'Safe and beautiful railings for stairs, balconies, and terraces.' }),
      img: "/jina.jpeg"
    },
    {
      title: t('services.items.4.title', { defaultValue: 'Custom Fabrication' }),
      desc: t('services.items.4.desc', { defaultValue: 'All kinds of custom iron fabrication tailored to customer needs.' }),
      img: "/custom.jpeg"
    },
    {
      title: t('services.items.5.title', { defaultValue: 'Welding & Repair' }),
      desc: t('services.items.5.desc', { defaultValue: 'All types of welding and repair work for iron structures.' }),
      img: "/weld.jpeg"
    }
  ];

  // Reviews state
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
    // Gallery items for service options
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [revErr, setRevErr] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');

  const isAdmin = !!localStorage.getItem('adminToken');
  const navigate = useNavigate();

  const avgRating = useMemo(() => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [reviews]);

  const loadReviews = async () => {
    try {
      setLoadingReviews(true);
      const data = await fetchReviews();
      setReviews(data);
    } catch (e: any) {
      setRevErr(e.message || 'Failed to load reviews');
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    loadReviews();
    // Load gallery items for service options
    (async () => {
      try {
        const data = await fetchGalleryImages();
        setGalleryItems(data);
      } catch {
        // silently ignore for Services page
      }
    })();
  }, []);

  const onSubmitReview = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await submitReview(name.trim(), rating, comment.trim());
      setName('');
      setRating(5);
      setComment('');
      await loadReviews();
    } catch (e: any) {
      setRevErr(e.message || 'Failed to submit review');
    }
  };

  const onDelete = async (id: string) => {
    try {
      await deleteReview(id);
      await loadReviews();
    } catch (e: any) {
      setRevErr(e.message || 'Failed to delete review');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-slate-900 py-20 text-center">
        <h1 className="text-4xl font-bold text-white uppercase tracking-widest">{t('services.header.title', { defaultValue: 'Our Capabilities' })}</h1>
        <p className="text-slate-400 mt-4">{t('services.header.subtitle', { defaultValue: 'World-class manufacturing solutions tailored to your specifications.' })}</p>
      </div>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white group overflow-hidden shadow-md border border-slate-200 flex flex-col"
              onClick={() => {
                const serviceKeys = [
                  'grill-fabrication',
                  'gate-fabrication',
                  'shed-fabrication',
                  'railing',
                  'custom-fabrication'
                
                ];
                const key = serviceKeys[index];
                if (key) {
                  navigate(`/gallery?serviceKey=${encodeURIComponent(key)}`);
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              <div className="relative overflow-hidden h-48">
                <img 
                  src={service.img} 
                  alt={service.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-transparent transition"></div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-3 uppercase text-slate-900">{service.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">{service.desc}</p>
                {/* Clicking card navigates to Gallery page with service filter */}
                <Link
                  to="/contact"
                  className="inline-flex items-center text-orange-600 font-bold uppercase text-xs tracking-widest hover:text-orange-700 transition"
                  onClick={(e) => e.stopPropagation()}
                >
                  {t('services.requestDetails', { defaultValue: 'Request Details' })}
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews & Ratings */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 uppercase tracking-wide">{t('services.reviews.title', { defaultValue: 'Reviews & Ratings' })}</h2>
          <p className="text-slate-600 mt-2">{t('services.reviews.avgLabel', { defaultValue: 'Average rating:' })} <span className="font-semibold">{avgRating || t('services.reviews.noRatings', { defaultValue: 'No ratings yet' })}</span>{reviews.length ? ` (${reviews.length})` : ''}</p>
        </header>

        {/* Submit review */}
        <form onSubmit={onSubmitReview} className="bg-white border border-slate-200 rounded p-4 mb-8 grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            className="border border-slate-300 rounded px-3 py-2"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <select
            className="border border-slate-300 rounded px-3 py-2"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            required
          >
            {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star{r>1?'s':''}</option>)}
          </select>
          <input
            className="border border-slate-300 rounded px-3 py-2 md:col-span-2"
            placeholder="Share your experience"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <div className="md:col-span-4 flex justify-end">
            <button className="px-5 py-2 bg-orange-600 text-white rounded hover:bg-orange-700" type="submit">{t('services.reviews.submit', { defaultValue: 'Submit Review' })}</button>
          </div>
        </form>

        {revErr ? <p className="text-red-600 mb-4">{revErr}</p> : null}
        {loadingReviews ? (
          <p>{t('services.reviews.loading', { defaultValue: 'Loading reviews...' })}</p>
        ) : (
          <ul className="space-y-4">
            {reviews.map(r => (
              <li key={r.id} className="bg-white border border-slate-200 rounded p-4 flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-slate-900">{r.name}</div>
                  <div className="text-sm text-amber-600">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                  <p className="text-slate-700 text-sm mt-1">{r.comment}</p>
                </div>
                {isAdmin && (
                  <button onClick={() => onDelete(r.id)} className="text-sm text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded">{t('common.delete', { defaultValue: 'Delete' })}</button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-orange-600 py-16 text-white text-center px-4">
        <h2 className="text-3xl font-bold uppercase mb-4 tracking-wide">{t('services.cta.title', { defaultValue: 'Have a Unique Requirement?' })}</h2>
        <p className="mb-8 max-w-2xl mx-auto">{t('services.cta.subtitle', { defaultValue: 'We thrive on complex engineering challenges. Contact our technical team today to discuss your custom project.' })}</p>
        <Link to="/contact" className="px-10 py-4 bg-slate-900 text-white hover:bg-slate-800 font-bold uppercase tracking-widest transition shadow-xl">
          {t('common.contact', { defaultValue: 'Contact' })}
        </Link>
      </section>
    </div>
  );
};

export default Services;
