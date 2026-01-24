
import React from 'react';
import { useTranslation } from 'react-i18next';

const About: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white uppercase tracking-wider">{t('about.header.title', { defaultValue: 'Our Heritage' })}</h1>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">{t('about.header.subtitle', { defaultValue: 'Built on a foundation of craftsmanship, technical expertise, and industrial innovation since 1998.' })}</p>
        </div>
      </div>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6 uppercase">{t('about.section.title', { defaultValue: 'Modern Tools, Traditional Standards' })}</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              त्रिमूर्ती फैब्रिकेटर्स हे गेल्या २५+ वर्षांपासून ग्रील, गेट, शेड, रेलिंग व सर्व प्रकारच्या लोखंडी फॅब्रिकेशन कामांमध्ये विश्वासार्ह नाव आहे.

आमच्या दीर्घ अनुभवाच्या जोरावर आम्ही घरगुती, व्यावसायिक व औद्योगिक कामांसाठी मजबूत बांधणी, अचूक माप आणि टिकाऊ गुणवत्ता देतो.

            </p>
            <p className="text-slate-600 mb-8 leading-relaxed">
              अनुभवी कारागिरी, दर्जेदार साहित्य आणि वेळेवर काम पूर्ण करून ग्राहकांचे समाधान मिळवणे हेच आमचे प्रमुख ध्येय आहे.

            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white shadow-sm border-l-4 border-orange-500">
                <h4 className="font-bold text-slate-900 uppercase text-sm mb-1">{t('about.mission.title', { defaultValue: 'Our Mission' })}</h4>
                <p className="text-xs text-slate-500">{t('about.mission.desc', { defaultValue: 'Deliver strong, durable, and quality fabrication tailored to customer needs, with 25+ years of experience.' })}</p>
              </div>
              <div className="p-4 bg-white shadow-sm border-l-4 border-orange-500">
                <h4 className="font-bold text-slate-900 uppercase text-sm mb-1">{t('about.vision.title', { defaultValue: 'Our Vision' })}</h4>
                <p className="text-xs text-slate-500">{t('about.vision.desc', { defaultValue: 'Be the trusted, leading fabrication workshop known for quality, integrity, and excellent craftsmanship.' })}</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="/ChatGPT%20Image%20Jan%2024,%202026,%2012_18_15%20AM.png" 
              alt={t('about.imageAlt', { defaultValue: 'Workshop Interior' })} 
              className="rounded shadow-2xl rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Removed certification section per request */}
    </div>
  );
};

export default About;
