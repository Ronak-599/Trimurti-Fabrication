import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoUrl from '../../WhatsApp Image 2026-01-23 at 13.37.33.jpeg';
import { useTranslation } from 'react-i18next';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const supportedLangs = ['en', 'mr', 'hi'] as const;
  const selectedLang = supportedLangs.includes(i18n.language as any)
    ? (i18n.language as (typeof supportedLangs)[number])
    : (supportedLangs.includes((i18n.resolvedLanguage || 'en') as any)
        ? (i18n.resolvedLanguage as (typeof supportedLangs)[number])
        : 'en');

  const isActive = (path: string) => location.pathname === path;

  const isLoggedIn = Boolean(localStorage.getItem('adminToken'));

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.services'), path: '/services' },
    { name: t('nav.gallery'), path: '/gallery' },
    { name: t('nav.contact'), path: '/contact' },
    // Show Login only when logged out
    ...(!isLoggedIn ? [{ name: t('nav.login', { defaultValue: 'Login' }), path: '/admin/login' }] : []),
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    // Close mobile menu and redirect home
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg border-b border-slate-800">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
              <div className="flex items-center gap-2 ml-2 sm:ml-3">
            <img src={logoUrl} alt={t('brand.alt', { defaultValue: 'Trimurti Fabricators' })} className="w-10 h-10 rounded object-cover" />
            <Link to="/" className="text-3xl md:text-4xl font-heading font-bold tracking-tighter text-slate-300 opacity-70 hover:opacity-100 hover:text-white">
              {t('brand.name', { defaultValue: 'Trimurti Fabricators' })}
            </Link>
          </div>
          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-semibold uppercase tracking-wider transition-colors duration-200 ${
                  isActive(link.path) ? 'text-orange-500' : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {/* Language Dropdown */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
              <label className="sr-only">{t('lang.label', { defaultValue: 'Language' })}</label>
              <select
                value={selectedLang}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="bg-slate-800 text-slate-200 text-sm px-2 py-1 rounded border border-slate-700 hover:border-slate-600"
              >
                <option value="en">{t('lang.en', { defaultValue: 'English' })}</option>
                <option value="mr">{t('lang.mr', { defaultValue: 'मराठी' })}</option>
                <option value="hi">{t('lang.hi', { defaultValue: 'हिंदी' })}</option>
              </select>
            </div>
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="text-sm font-semibold uppercase tracking-wider text-slate-300 hover:text-white"
              >
                {t('nav.logout', { defaultValue: 'Logout' })}
              </button>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path) ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {/* Mobile language dropdown */}
            <div className="flex items-center gap-3 px-3 py-2">
              <label className="sr-only">{t('lang.label', { defaultValue: 'Language' })}</label>
              <select
                value={selectedLang}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="bg-slate-800 text-slate-200 text-sm px-2 py-1 rounded border border-slate-700 hover:border-slate-600 w-full"
              >
                <option value="en">{t('lang.en', { defaultValue: 'English' })}</option>
                <option value="mr">{t('lang.mr', { defaultValue: 'मराठी' })}</option>
                <option value="hi">{t('lang.hi', { defaultValue: 'हिंदी' })}</option>
              </select>
            </div>
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                {t('nav.logout', { defaultValue: 'Logout' })}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
// LanguageSwitcher component defined inline above in Header