'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useSpring, useTransform, animate } from 'framer-motion';
import { FiTarget, FiCode, FiZap, FiAward, FiCoffee, FiCpu } from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';
import { Settings } from '@/types';

interface AboutProps {
  settings: Settings | null;
}

function Counter({ value, label, icon }: { value: number; label: string; icon: React.ReactNode }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (latest) => setDisplayValue(Math.floor(latest))
      });
      return () => controls.stop();
    }
  }, [value, isInView]);

  return (
    <motion.div 
      ref={ref} 
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-5 cursor-default group"
    >
      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-surface-dark shadow-sm border border-surface-border flex items-center justify-center text-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-500 group-hover:text-white group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-brand-500/20">
        {icon}
      </div>
      <div>
        <div className="flex items-baseline gap-0.5">
          <span className="text-2xl font-bold text-text-primary">{displayValue}</span>
          <span className="text-brand-500 font-bold group-hover:scale-125 transition-transform duration-300">+</span>
        </div>
        <p className="text-xs text-text-muted font-mono uppercase tracking-widest font-bold group-hover:text-brand-500 transition-colors duration-300">{label}</p>
      </div>
    </motion.div>
  );
}

export default function About({ settings }: AboutProps) {
  const { t } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const isLoading = !settings;

  const items = [
    {
      icon: <FiTarget size={24} />,
      title: t('about.items.precision.title'),
      desc: t('about.items.precision.desc'),
      color: 'blue'
    },
    {
      icon: <FiCode size={24} />,
      title: t('about.items.clean_code.title'),
      desc: t('about.items.clean_code.desc'),
      color: 'violet'
    },
    {
      icon: <FiZap size={24} />,
      title: t('about.items.speed.title'),
      desc: t('about.items.speed.desc'),
      color: 'emerald'
    }
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/[0.03] dark:bg-brand-500/[0.05] rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-500/[0.03] dark:bg-accent-500/[0.05] rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400 mb-4">{t('nav.about')}</h2>
        </motion.div>

        {/* Bento Grid */}
        <motion.div 
          ref={ref} 
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1,
              transition: { staggerChildren: 0.15 }
            }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-6 gap-6"
        >

          {/* Main Bio Card */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: [30, -5, 0], transition: { duration: 0.6 } }
            }}
            whileHover={{ y: -5, borderColor: 'rgba(59, 130, 246, 0.4)' }}
            className="md:col-span-4 glass p-8 md:p-10 rounded-[2.5rem] border border-surface-border relative overflow-hidden group shadow-xl dark:shadow-none transition-colors duration-300"
          >
            {/* Decorative Icon */}
            <div className="absolute -bottom-12 -right-12 text-[15rem] text-text-muted/[0.03] dark:text-text-muted/[0.02] -rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-transform duration-1000 z-[-1] pointer-events-none select-none">
              <FiCpu />
            </div>

            <div className="relative z-10 h-full flex flex-col justify-center">
              <h3 className="text-3xl md:text-5xl font-bold text-text-primary mb-6 leading-tight">
                {isLoading ? (
                  <div className="w-full h-12 bg-surface-loading animate-shimmer rounded-2xl" />
                ) : (
                  <>
                    {t('about.subtitle').includes('mobile applications') ? (
                      <>
                        {t('about.subtitle').split('mobile applications')[0]}
                        <span className="gradient-text">mobile applications</span>
                        {t('about.subtitle').split('mobile applications')[1]}
                      </>
                    ) : t('about.subtitle').includes('تطبيقات الهاتف') ? (
                      <>
                        {t('about.subtitle').split('تطبيقات الهاتف')[0]}
                        <span className="gradient-text">تطبيقات الهاتف</span>
                        {t('about.subtitle').split('تطبيقات الهاتف')[1]}
                      </>
                    ) : (
                      t('about.subtitle')
                    )}
                  </>
                )}
              </h3>
              <div className="text-text-secondary text-lg md:text-xl leading-relaxed font-medium">
                {isLoading ? (
                  <div className="space-y-4">
                    <div className="w-full h-5 bg-surface-loading animate-shimmer rounded" />
                    <div className="w-11/12 h-5 bg-surface-loading animate-shimmer rounded" />
                    <div className="w-4/5 h-5 bg-surface-loading animate-shimmer rounded" />
                  </div>
                ) : (
                  settings?.bio || t('about.description')
                )}
              </div>
            </div>
          </motion.div>

          {/* Stats Card */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: [30, -5, 0], transition: { duration: 0.6 } }
            }}
            whileHover={{ y: -5, borderColor: 'rgba(139, 92, 246, 0.4)' }}
            className="md:col-span-2 glass p-8 rounded-[2.5rem] border border-surface-border flex flex-col justify-between shadow-xl dark:shadow-none bg-brand-500/[0.02] dark:bg-brand-500/[0.02] transition-colors duration-300"
          >
            <div className="space-y-8">
              <Counter
                value={settings?.experienceYears || 0}
                label={t('about.stats.experience')}
                icon={<FiAward className="text-blue-500" />}
              />
              <Counter
                value={settings?.projectsCompleted || 0}
                label={t('about.stats.projects')}
                icon={<FiCpu className="text-violet-500" />}
              />
              <Counter
                value={settings?.technologiesCount || 0}
                label={t('about.stats.technologies')}
                icon={<FiZap className="text-emerald-500" />}
              />
            </div>
          </motion.div>

          {/* Feature Cards Loop */}
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: [0.95, 1.02, 1] }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className={`md:col-span-2 glass p-8 rounded-[2rem] border border-surface-border group hover:border-brand-500/30 transition-all duration-500 shadow-xl dark:shadow-none hover:shadow-2xl dark:hover:shadow-brand-500/5 hover:-translate-y-2`}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 mb-6 transition-all duration-500 ${item.color === 'blue' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white shadow-blue-500/10' :
                  item.color === 'violet' ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400 group-hover:bg-violet-600 group-hover:text-white shadow-violet-500/10' :
                    'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white shadow-emerald-500/10'
                }`}>
                {item.icon}
              </div>
              <div>
                <h4 className="text-2xl font-bold text-text-primary mb-3">{item.title}</h4>
                <p className="text-text-secondary text-sm leading-relaxed font-medium">{item.desc}</p>
              </div>
            </motion.div>
          ))}

          {/* Coffee/Misc Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="md:col-span-full lg:col-span-full glass p-6 rounded-[2rem] border border-surface-border flex items-center justify-center gap-4 group"
          >
            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 animate-bounce">
              <FiCoffee size={20} />
            </div>
            <p className="text-text-muted font-mono text-xs uppercase tracking-[0.3em] font-bold">
              Fuelled by passion & plenty of coffee
            </p>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
