
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-orange-600 flex items-center justify-center rounded">
              <span className="text-white text-lg font-bold italic">F</span>
            </div>
            <span className="text-white text-lg font-heading font-bold">{t('brand.name', { defaultValue: 'Trimurti Fabricators' })}</span>
          </div>
          <p className="max-w-md text-sm leading-relaxed mb-6">
            {t('footer.description', {
              defaultValue:
                'We deliver grills, gates, sheds, railings, and custom fabrication with strong construction and precise finishing. Reliable service for residential, commercial, and industrial projects.'
            })}
          </p>
          {/* Social links removed as requested */}
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-widest">{t('footer.quickLinks', { defaultValue: 'Quick Links' })}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-orange-500">{t('nav.home')}</Link></li>
            <li><Link to="/about" className="hover:text-orange-500">{t('footer.aboutShop', { defaultValue: 'About Our Shop' })}</Link></li>
            <li><Link to="/services" className="hover:text-orange-500">{t('nav.services')}</Link></li>
            <li><Link to="/contact" className="hover:text-orange-500">{t('footer.getQuote', { defaultValue: 'Get a Quote' })}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-widest">{t('footer.contactInfo', { defaultValue: 'Contact Info' })}</h4>
          <ul className="space-y-2 text-sm">
            <li>{t('footer.address.line1', { defaultValue: 'Navipeth, Panyachi Taki Road' })}</li>
            <li>{t('footer.address.line2', { defaultValue: 'Chhatrapati Nagar, Rahuri, Dist. Ahmednagar' })}</li>
            <li>{t('contact.phone', { defaultValue: 'Phone' })}: 9822308291</li>
            {/* <li>E: sales@forgeprecision.com</li> */}
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-xs">
        &copy; {new Date().getFullYear()} {t('footer.copyright', { defaultValue: 'Trimurti Fabrication Inc. All Rights Reserved. ISO 9001:2015 Certified.' })}
      </div>
    </footer>
  );
};

export default Footer;
