
import React, { useState } from 'react';
import { ContactFormData, FormStatus } from '../types';
import { submitContactForm } from '../utils/api';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = (): boolean => {
    if (!formData.name.trim()) return false;
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) return false;
    if (!formData.message.trim()) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      setErrorMsg('Please fill in all required fields with a valid email.');
      return;
    }

    setStatus('loading');
    setErrorMsg(null);

    try {
      await submitContactForm(formData);
      setStatus('success');
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err.message || 'An unexpected error occurred. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 p-8 text-center rounded-lg shadow-sm">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-green-800 mb-2">Message Sent Successfully</h3>
        <p className="text-green-600 mb-6">Thank you for reaching out. Our engineering team will review your request and get back to you shortly.</p>
        <button 
          onClick={() => setStatus('idle')}
          className="px-6 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-lg shadow-xl border border-slate-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="name" className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
            placeholder="John Doe"
            disabled={status === 'loading'}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">Work Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
            placeholder="john@company.com"
            disabled={status === 'loading'}
            required
          />
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="subject" className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">Inquiry Type</label>
        <select
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
          disabled={status === 'loading'}
        >
          <option>General Inquiry</option>
          <option>Custom Machining Quote</option>
          <option>Welding & Fabrication</option>
          <option>Project Consultation</option>
          <option>Job Opportunities</option>
        </select>
      </div>

      <div className="mb-6">
        <label htmlFor="message" className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">Project Details *</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition resize-none"
          placeholder="Please describe your project specifications..."
          disabled={status === 'loading'}
          required
        ></textarea>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className={`w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-widest rounded transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 ${
          status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {status === 'loading' ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting Request...
          </>
        ) : 'Request Quote'}
      </button>
      
      <p className="mt-4 text-xs text-slate-500 text-center italic">
        * Our average response time for engineering quotes is 24-48 hours.
      </p>
    </form>
  );
};

export default ContactForm;
