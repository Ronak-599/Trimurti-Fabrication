/*
  Static Contact page (no forms or backend calls)
  - Shows company address, phone (click-to-call), email (display only), hours
  - WhatsApp button opens new tab
  - Embedded Google Map to workshop location
  - Button to download visiting card from /public/visiting-card.pdf
*/

import React from 'react';
import { useTranslation } from 'react-i18next';

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const addressLine1 = 'नवीपेठ,पाण्याची टाकी रोड, ';
  const addressLine2 = 'छत्रपती नगर, राहुरी, जि.अ.नगर';
  const phoneNumber = '+91 9822308291'; // E.164 for tel:/WhatsApp
  const phoneDisplay = '+91 98223 08291';
  const emailDisplay = 'ronakpawar488@gmail.com';

  const whatsappHref = `https://wa.me/${9822308291}?text=${encodeURIComponent('Hello, I would like to discuss a fabrication quote.')}`;
  // Map configuration
  // 1) Preferred: paste the full Google Maps "Embed a map" URL here (starts with https://www.google.com/maps/embed?pb=...)
  //    How to get it: Open your place in Google Maps → Share → Embed a map → Copy HTML → copy the src value.
  const mapEmbedPreferred = '';

  // 2) Optional: a share URL for the "Open in Google Maps" button (not used for the iframe itself)
  const mapShareUrl = 'https://maps.app.goo.gl/3sACJXduUu1CCFyz7?g_st=aw';

  // 3) Fallback: if no embed link is provided above, we build an embed URL using the address text
  const mapFallbackAddress = `${addressLine1}, ${addressLine2}`;
  const mapEmbedSrc = mapEmbedPreferred
    ? mapEmbedPreferred
    : `https://www.google.com/maps?q=${encodeURIComponent(mapFallbackAddress)}&z=16&output=embed`;

  return (
    <main className="bg-slate-50 min-h-screen">
      <header className="bg-slate-900 py-16 text-center">
        <h1 className="text-4xl font-bold text-white uppercase tracking-widest">{t('contact.headerTitle', { defaultValue: 'Contact Us' })}</h1>
        <p className="text-slate-400 mt-3">{t('contact.headerSubtitle', { defaultValue: 'We respond within one business day.' })}</p>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Info */}
        <aside className="lg:col-span-1 space-y-8">
          <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-wide">{t('contact.companyInfo', { defaultValue: 'Company Information' })}</h2>
          <address className="not-italic space-y-4 text-sm text-slate-700">
            <div>
              <div className="font-semibold text-slate-900 uppercase text-xs mb-1">{t('contact.address', { defaultValue: 'Address' })}</div>
              <p>{addressLine1}<br />{addressLine2}</p>
            </div>
            <div>
              <div className="font-semibold text-slate-900 uppercase text-xs mb-1">{t('contact.phone', { defaultValue: 'Phone' })}</div>
              <a className="text-blue-600 hover:underline" href={`tel:${phoneNumber}`}>{phoneDisplay}</a>
            </div>
            <div>
              <div className="font-semibold text-slate-900 uppercase text-xs mb-1">{t('contact.email', { defaultValue: 'Email' })}</div>
              <p>{emailDisplay}</p>
            </div>
            <div>
              <div className="font-semibold text-slate-900 uppercase text-xs mb-1">{t('contact.workingHours', { defaultValue: 'Working Hours' })}</div>
              <p>{t('contact.hoursDetail', { defaultValue: 'Mon - Fri: 7:00 AM – 6:00 PM\nSat: 8:00 AM – 1:00 PM (By Appt)' }).split('\n').map((line, idx) => (<span key={idx}>{line}{idx===0? <br/>: null}</span>))}</p>
            </div>
          </address>

          <div className="flex gap-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
            >
              <span>{t('contact.whatsapp', { defaultValue: 'WhatsApp' })}</span>
            </a>
            <a
              href="/Visiting%20card.pdf"
              download="Visiting card.pdf"
              className="inline-flex items-center gap-2 px-4 py-2 rounded bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700"
            >
              {t('contact.downloadCard', { defaultValue: 'Download My Card' })}
            </a>
          </div>
        </aside>

        {/* Map */}
        <section className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-wide">{t('contact.findWorkshop', { defaultValue: 'Find Our Workshop' })}</h2>
          <div className="w-full h-96 rounded overflow-hidden shadow">
            <iframe
              title="ForgePrecision Workshop Map"
              src={mapEmbedSrc}
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div>
            <a
              href={mapShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
            >
              {t('contact.viewOnMaps', { defaultValue: 'View on Google Maps' })}
            </a>
          </div>
        </section>
      </section>
    </main>
  );
};

export default Contact;
