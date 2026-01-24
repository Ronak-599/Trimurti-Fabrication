
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  const [mounted, setMounted] = React.useState(false);
  const { t } = useTranslation();

  React.useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id as unknown as number);
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="/publicfabrication-hero.jpg" 
            alt="Fabrication Workshop" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className={`max-w-2xl transform transition-all duration-700 ease-out will-change-transform ${
              mounted ? 'opacity-100 translate-x-[35px]' : 'opacity-0 translate-x-full'
            }`}
          >
            <span className="inline-block py-1 px-3 bg-orange-600 text-white text-xs font-bold uppercase tracking-widest mb-4">
              {t('hero.tagline', { defaultValue: 'Market Leaders in Metal Fabrication' })}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              {t('hero.title1', { defaultValue: 'Trimurti' })} <span className="text-orange-500"> {t('hero.title2', { defaultValue: 'Fabricators & Engineering' })}</span>
            </h1>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              {t('hero.description')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/services" className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-widest transition shadow-lg">
                {t('hero.ctaServices', { defaultValue: 'Our Services' })}
              </Link>
              <Link to="/contact" className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-slate-900 font-bold uppercase tracking-widest transition">
                {t('hero.ctaContact', { defaultValue: 'Contact' })}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="group">
              <div className="w-16 h-16 bg-slate-100 flex items-center justify-center mb-6 group-hover:bg-orange-600 transition-colors">
                <svg className="w-8 h-8 text-orange-600 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 uppercase">{t('features.f1.title', { defaultValue: 'Strong and Quality Work' })}</h3>
              <p className="text-slate-600">{t('features.f1.desc', { defaultValue: 'We deliver robust ironworks like grills, gates, and sheds with durable build quality you can trust.' })}</p>
            </div>
            <div className="group">
              <div className="w-16 h-16 bg-slate-100 flex items-center justify-center mb-6 group-hover:bg-orange-600 transition-colors">
                <svg className="w-8 h-8 text-orange-600 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 uppercase">{t('features.f2.title', { defaultValue: 'Experienced Craftsmanship' })}</h3>
              <p className="text-slate-600">{t('features.f2.desc', { defaultValue: 'Skilled craftsmen with years of experience deliver precise measurements and perfect finishing.' })}</p>
            </div>
            <div className="group">
              <div className="w-16 h-16 bg-slate-100 flex items-center justify-center mb-6 group-hover:bg-orange-600 transition-colors">
                <svg className="w-8 h-8 text-orange-600 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 uppercase">{t('features.f3.title', { defaultValue: 'On-time and Reliable Service' })}</h3>
              <p className="text-slate-600">{t('features.f3.desc', { defaultValue: 'We complete projects on schedule with customer satisfaction as our primary goal.' })}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-orange-500 mb-2">25+</div>
            <div className="text-xs uppercase tracking-widest text-slate-400">{t('stats.yearsExperience', { defaultValue: 'Years Experience' })}</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-orange-500 mb-2">500+</div>
            <div className="text-xs uppercase tracking-widest text-slate-400">{t('stats.clientsWorldwide', { defaultValue: 'Clients Worldwide' })}</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-orange-500 mb-2">12k</div>
            <div className="text-xs uppercase tracking-widest text-slate-400">{t('stats.projectsCompleted', { defaultValue: 'Projects Completed' })}</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-orange-500 mb-2">0.02mm</div>
            <div className="text-xs uppercase tracking-widest text-slate-400">{t('stats.toleranceLevel', { defaultValue: 'Tolerance Level' })}</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
