'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiSmartphone, FiLayout, FiCloud, FiZap } from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';
import { getServices } from '@/services/serviceService';
import { ServiceItem } from '@/types';

const iconMap: Record<string, any> = {
  mobile: FiSmartphone,
  ui: FiLayout,
  api: FiCloud,
  optimization: FiZap,
};

const colorMap: Record<string, string> = {
  blue: 'from-blue-600/20 to-blue-600/5 border-blue-500/20 group-hover:border-blue-500/40',
  violet: 'from-violet-600/20 to-violet-600/5 border-violet-500/20 group-hover:border-violet-500/40',
  cyan: 'from-cyan-600/20 to-cyan-600/5 border-cyan-500/20 group-hover:border-cyan-500/40',
  amber: 'from-amber-600/20 to-amber-600/5 border-amber-500/20 group-hover:border-amber-500/40',
};

const iconColorMap: Record<string, string> = {
  blue: 'text-blue-400 bg-blue-500/10',
  violet: 'text-violet-400 bg-violet-500/10',
  cyan: 'text-cyan-400 bg-cyan-500/10',
  amber: 'text-amber-400 bg-amber-500/10',
};

export default function Services() {
  const { t, language } = useLanguage();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        console.error('Failed to load services', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadServices();
  }, []);

  return (
    <section id="services" className="py-24 bg-surface-card/30" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-blue-400 font-mono text-sm">// 04. services</span>
          <h2 className="text-4xl font-bold mt-2">
            {t('services.title')} <span className="gradient-text">{t('services.subtitle')}</span>
          </h2>
          <p className="text-text-secondary mt-3 max-w-xl mx-auto">
            {t('services.description')}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            [1, 2, 3, 4].map((n) => (
              <div key={n} className="glass rounded-2xl p-6 h-64 animate-shimmer">
                <div className="w-12 h-12 bg-surface-loading rounded-xl mb-5" />
                <div className="w-2/3 h-6 bg-surface-loading rounded mb-3" />
                <div className="w-full h-12 bg-surface-loading rounded mb-5" />
                <div className="flex gap-2">
                  <div className="w-12 h-4 bg-surface-loading rounded-full" />
                  <div className="w-12 h-4 bg-surface-loading rounded-full" />
                </div>
              </div>
            ))
          ) : (
            services.map((svc, i) => {
              const Icon = iconMap[svc.key] || FiSmartphone;
              return (
                <motion.div
                  key={svc.key}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`group rounded-2xl p-6 border bg-gradient-to-br ${colorMap[svc.color] || colorMap.blue} hover:-translate-y-2 transition-all duration-300 cursor-default`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${iconColorMap[svc.color] || iconColorMap.blue}`}>
                    {svc.icon && !iconMap[svc.key] ? (
                      <span className="text-2xl">{svc.icon}</span>
                    ) : (
                      <Icon size={24} />
                    )}
                  </div>
                  <h3 className={`text-lg font-bold text-text-primary mb-3 leading-snug ${language === 'ar' ? 'text-right' : ''}`}>{t(`services.list.${svc.key}.title`)}</h3>
                  <p className={`text-text-secondary text-sm leading-relaxed mb-5 ${language === 'ar' ? 'text-right' : ''}`}>{t(`services.list.${svc.key}.desc`)}</p>
                  <div className={`flex flex-wrap gap-1.5 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    {svc.tech.map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-surface-border text-text-secondary font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
