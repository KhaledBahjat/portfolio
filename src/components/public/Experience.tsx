'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiCalendar, FiBriefcase, FiBook } from 'react-icons/fi';
import { getExperience } from '@/services/experienceService';
import { Experience } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { formatDate } from '@/utils/helpers';

const demoExperience: Experience[] = [
  {
    id: '1',
    title: 'Flutter Developer',
    organization: 'Freelance',
    description: 'Building cross-platform mobile apps using Flutter & Firebase for various clients.',
    startDate: '2024-01',
    endDate: null,
    type: 'work',
  },
  {
    id: '2',
    title: 'Computer Science Student',
    organization: 'University',
    description: 'Studying Computer Science fundamentals — algorithms, data structures, software engineering.',
    startDate: '2022-09',
    endDate: null,
    type: 'education',
  },
  {
    id: '3',
    title: 'Mobile Dev Intern',
    organization: 'Tech Startup',
    description: 'Developed Flutter features, improved app performance by 30%, worked in agile team.',
    startDate: '2023-06',
    endDate: '2023-09',
    type: 'work',
  },
];

export default function ExperienceSection() {
  const { t, language } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [items, setItems] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getExperience()
      .then((data) => setItems(data.length ? data : demoExperience))
      .catch(() => setItems(demoExperience))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section id="experience" className="py-24" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-blue-600 dark:text-blue-400 font-mono text-sm uppercase tracking-widest">// 05. experience</span>
          <h2 className="text-4xl font-bold mt-2 text-text-primary">
            {t('experience.title')} <span className="gradient-text">{t('experience.subtitle')}</span>
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto relative">
          {/* Vertical line */}
          <div className={`absolute ${language === 'en' ? 'left-6' : 'right-6'} top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500/50 via-violet-500/50 to-transparent`} />

          <div className="space-y-8">
            {isLoading ? (
              [1, 2, 3].map((n) => (
                <div key={n} className={`relative ${language === 'en' ? 'pl-16' : 'pr-16'} animate-shimmer`}>
                  <div className={`absolute ${language === 'en' ? 'left-4' : 'right-4'} top-6 w-4 h-4 rounded-full border-2 border-surface-border bg-surface-loading ${language === 'en' ? '-translate-x-1/2' : 'translate-x-1/2'}`} />
                  <div className="glass rounded-2xl p-6">
                    <div className="w-1/3 h-5 bg-surface-loading rounded mb-3" />
                    <div className="w-1/4 h-4 bg-surface-loading rounded mb-4" />
                    <div className="w-full h-16 bg-surface-loading rounded" />
                  </div>
                </div>
              ))
            ) : (
              items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: language === 'en' ? -30 : 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className={`relative ${language === 'en' ? 'pl-16' : 'pr-16'}`}
                >
                  {/* Dot */}
                  <div className={`absolute ${language === 'en' ? 'left-4' : 'right-4'} top-6 w-4 h-4 rounded-full border-2 flex items-center justify-center ${language === 'en' ? '-translate-x-1/2' : 'translate-x-1/2'} ${
                    item.type === 'work'
                      ? 'border-blue-500 bg-blue-500/10 dark:bg-blue-500/20'
                      : 'border-violet-500 bg-violet-500/10 dark:bg-violet-500/20'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${item.type === 'work' ? 'bg-blue-600 dark:bg-blue-400' : 'bg-violet-600 dark:bg-violet-400'}`} />
                  </div>

                  <div className="glass rounded-2xl p-6 hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                      <div className={language === 'ar' ? 'text-right w-full sm:w-auto' : ''}>
                        <h3 className="text-lg font-bold text-text-primary tracking-tight">{item.title}</h3>
                        <p className={`text-sm font-bold tracking-wide ${item.type === 'work' ? 'text-blue-700 dark:text-blue-400' : 'text-violet-700 dark:text-violet-400'}`}>
                          {item.organization}
                        </p>
                      </div>
                      <div className={`flex items-center gap-2 text-xs text-text-secondary font-medium shrink-0 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                        {item.type === 'education'
                          ? <FiBook size={12} className="text-violet-700 dark:text-violet-400" />
                          : <FiBriefcase size={12} className="text-blue-700 dark:text-blue-400" />
                        }
                        <span className={`flex items-center gap-1 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                          <FiCalendar size={12} className="text-text-muted" />
                          {item.startDate} – {item.endDate ?? t('experience.present')}
                        </span>
                      </div>
                    </div>
                    <p className={`text-text-secondary text-sm leading-relaxed ${language === 'ar' ? 'text-right' : ''}`}>{item.description}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
