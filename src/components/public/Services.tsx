'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiSmartphone, FiLayout, FiCloud, FiZap, FiCheckCircle, FiCode, FiSmartphone as FiMobile } from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';

const servicesList = [
  {
    key: 'mobile',
    icon: FiMobile,
    color: 'blue',
    tech: ['Flutter', 'Dart', 'Firebase', 'Clean Architecture'],
  },
  {
    key: 'ui',
    icon: FiLayout,
    color: 'violet',
    tech: ['Custom Widgets', 'Animations', 'Material 3', 'Responsive Design'],
  },
  {
    key: 'api',
    icon: FiCloud,
    color: 'cyan',
    tech: ['REST APIs', 'Supabase', 'GraphQL', 'WebSockets'],
  },
  {
    key: 'optimization',
    icon: FiZap,
    color: 'amber',
    tech: ['Performance', 'Memory Profiling', 'Bundle Size', 'CI/CD'],
  },
  // Add more services here manually
  /*
  {
    key: 'consultancy',
    icon: FiCode,
    color: 'blue',
    tech: ['Code Review', 'Architecture Design', 'Mentorship'],
  },
  */
];

const colorMap: Record<string, string> = {
  blue: 'from-blue-600/20 to-blue-600/5 border-blue-500/20 group-hover:border-blue-500/50 shadow-blue-500/5',
  violet: 'from-violet-600/20 to-violet-600/5 border-violet-500/20 group-hover:border-violet-500/50 shadow-violet-500/5',
  cyan: 'from-cyan-600/20 to-cyan-600/5 border-cyan-500/20 group-hover:border-cyan-500/50 shadow-cyan-500/5',
  amber: 'from-amber-600/20 to-amber-600/5 border-amber-500/20 group-hover:border-amber-500/50 shadow-amber-500/5',
};

const iconStyleMap: Record<string, string> = {
  blue: 'bg-blue-500/10 text-blue-500 shadow-lg shadow-blue-500/20',
  violet: 'bg-violet-500/10 text-violet-500 shadow-lg shadow-violet-500/20',
  cyan: 'bg-cyan-500/10 text-cyan-500 shadow-lg shadow-cyan-500/20',
  amber: 'bg-amber-500/10 text-amber-500 shadow-lg shadow-amber-500/20',
};

export default function Services() {
  const { t, language } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="services" className="py-24 relative overflow-hidden" ref={ref}>
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px] -z-10" />
      
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-blue-500 font-mono text-xs uppercase tracking-widest font-bold">What I Offer</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 tracking-tight">
            {t('services.title')} <span className="gradient-text">{t('services.subtitle')}</span>
          </h2>
          <p className="text-text-secondary mt-4 max-w-2xl mx-auto text-lg leading-relaxed">
            {t('services.description')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesList.map((svc, i) => {
            const Icon = svc.icon;
            const colorClass = colorMap[svc.color] || colorMap.blue;
            const iconClass = iconStyleMap[svc.color] || iconStyleMap.blue;
            
            return (
              <motion.div
                key={svc.key}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className={`group relative rounded-[2rem] p-8 border bg-gradient-to-br ${colorClass} backdrop-blur-md transition-all duration-300 flex flex-col h-full overflow-hidden`}
              >
                {/* Hover Glow Effect */}
                <div className={`absolute -right-8 -top-8 w-32 h-32 blur-[40px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-full ${svc.color === 'blue' ? 'bg-blue-600' : svc.color === 'violet' ? 'bg-violet-600' : 'bg-cyan-600'}`} />

                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${iconClass}`}>
                  <Icon size={28} />
                </div>

                <h3 className={`text-xl font-bold text-text-primary mb-3 leading-tight transition-colors group-hover:text-blue-400 ${language === 'ar' ? 'text-right' : ''}`}>
                  {t(`services.list.${svc.key}.title`)}
                </h3>
                
                <p className={`text-text-secondary text-sm leading-relaxed mb-6 flex-1 ${language === 'ar' ? 'text-right' : ''}`}>
                  {t(`services.list.${svc.key}.desc`)}
                </p>

                <div className={`flex flex-wrap gap-2 pt-4 border-t border-surface-border/50 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  {svc.tech.map((tech) => (
                    <div key={tech} className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 dark:bg-black/10 border border-surface-border/30">
                      <FiCheckCircle size={10} className="text-blue-500/70" />
                      <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-text-secondary">
                        {tech}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
