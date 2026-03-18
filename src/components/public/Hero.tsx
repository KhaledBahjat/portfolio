'use client';

import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiArrowRight, FiSmartphone, FiCpu } from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';
import { Settings } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';

interface HeroProps {
  settings: Settings | null;
}

export default function Hero({ settings }: HeroProps) {
  const { t, language } = useLanguage();
  const isLoading = !settings;
  const name = settings?.developerName || (isLoading ? '...' : 'Khaled');
  const title = settings?.title || (isLoading ? '...' : (language === 'en' ? 'Flutter Developer' : 'مطور فلاتر'));
  const tagline = settings?.tagline || (isLoading ? '...' : (language === 'en' 
    ? 'Building production-ready mobile experiences with Dart and Flutter.' 
    : 'بناء تجارب تطبيقات جوال جاهزة للإنتاج باستخدام دارت وفلاتر.'));
  const profileImage = settings?.profileImage || '/images/hero-profile.png';

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-10">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-600/[0.08] dark:bg-brand-600/20 blur-[120px] animate-pulse rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/[0.08] dark:bg-violet-600/20 blur-[120px] animate-pulse rounded-full delay-700" />
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* Text Content */}
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1,
                transition: { staggerChildren: 0.2, duration: 0.6 }
              }
            }}
            initial="hidden"
            animate="visible"
          >
            <motion.span 
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 }
              }}
              className="inline-block py-1 px-3 rounded-full bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-mono tracking-widest uppercase mb-4 border border-brand-500/20"
            >
              {t('hero.status')}
            </motion.span>
            
            <motion.h1 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="text-5xl lg:text-7xl font-bold text-text-primary mb-6 leading-tight"
            >
              {t('hero.greeting')}{' '}
              {isLoading ? (
                <div className="inline-block w-48 h-16 bg-surface-loading animate-shimmer rounded-xl align-middle" />
              ) : (
                <span className="gradient-text">{name}</span>
              )}
            </motion.h1>

            <motion.h2 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="text-2xl lg:text-3xl font-bold text-text-secondary mb-6 font-mono"
            >
              {isLoading ? (
                <div className="w-64 h-8 bg-surface-loading animate-shimmer rounded-lg" />
              ) : (
                title
              )}
            </motion.h2>

            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="text-text-secondary text-lg mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
            >
              {isLoading ? (
                <div className="space-y-3">
                  <div className="w-full h-4 bg-surface-loading animate-shimmer rounded" />
                  <div className="w-3/4 h-4 bg-surface-loading animate-shimmer rounded" />
                </div>
              ) : (
                tagline
              )}
            </motion.div>

            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
            >
              <Link href="#projects">
                <Button size="lg" className="group">
                  {t('hero.view_projects')}
                  <FiArrowRight className={`group-hover:translate-x-1 transition-transform ${language === 'ar' ? 'rotate-180' : ''}`} />
                </Button>
              </Link>
              <Link href="#contact">
                <Button variant="glass" size="lg">
                  {t('hero.contact_me')}
                </Button>
              </Link>
            </motion.div>

            {/* Social Links */}
            <motion.div 
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 }
              }}
              className="flex items-center justify-center lg:justify-start gap-6 mt-12 text-text-secondary"
            >
              {settings?.socialLinks?.github && (
                <motion.a 
                  variants={{ hidden: { scale: 0 }, visible: { scale: [0, 1.2, 1], transition: { duration: 0.4 } } }}
                  whileHover={{ y: -5, color: '#60a5fa' }} 
                  href={settings.socialLinks.github} target="_blank" rel="noopener noreferrer" className="transition-colors"
                >
                  <FiGithub size={22} />
                </motion.a>
              )}
              {settings?.socialLinks?.linkedin && (
                <motion.a 
                  variants={{ hidden: { scale: 0 }, visible: { scale: [0, 1.2, 1], transition: { duration: 0.4 } } }}
                  whileHover={{ y: -5, color: '#60a5fa' }} 
                  href={settings.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="transition-colors"
                >
                  <FiLinkedin size={22} />
                </motion.a>
              )}
              {settings?.socialLinks?.email && (
                <motion.a 
                  variants={{ hidden: { scale: 0 }, visible: { scale: [0, 1.2, 1], transition: { duration: 0.4 } } }}
                  whileHover={{ y: -5, color: '#60a5fa' }} 
                  href={`mailto:${settings.socialLinks.email}`} className="transition-colors"
                >
                  <FiMail size={22} />
                </motion.a>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Profile Image / Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 relative"
        >
          <div className="relative w-64 h-64 lg:w-96 lg:h-96 mx-auto">
            {/* Geometric Shapes */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-accent-600 rounded-3xl rotate-6 blur-2xl opacity-20 animate-pulse" />
            <div className="absolute inset-0 border-2 border-surface-border rounded-3xl rotate-12" />
            
            {/* Image Container */}
            <motion.div 
              whileHover={{ rotate: 0, scale: 1.05 }}
              animate={{ y: [0, -15, 0] }}
              transition={{ 
                y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: 0.5 },
                scale: { duration: 0.5 }
              }}
              className="relative w-full h-full glass border border-surface-border rounded-3xl overflow-hidden shadow-2xl z-20 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-full h-full bg-surface-loading animate-shimmer" />
              ) : (
                <Image
                  src={profileImage}
                  alt={name}
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </motion.div>

            {/* Desktop Floating Badges */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="hidden lg:flex absolute -top-6 -right-6 glass p-4 rounded-2xl border border-surface-border items-center gap-3 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-xl backdrop-blur-xl z-30"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 dark:bg-brand-500/20 flex items-center justify-center text-brand-700 dark:text-brand-400">
                <FiSmartphone size={20} />
              </div>
              <div className="text-xs font-bold text-text-primary">
                {t('hero.mobile_dev')}
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="hidden lg:flex absolute -bottom-6 -left-6 glass p-4 rounded-2xl border border-surface-border items-center gap-3 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-xl backdrop-blur-xl z-30"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center text-violet-700 dark:text-violet-400">
                <FiCpu size={20} />
              </div>
              <div className="text-xs font-bold text-text-primary">
                {t('hero.flutter_expert')}
              </div>
            </motion.div>
          </div>

          {/* Mobile Badges (Repositioned below image) */}
          <div className="flex lg:hidden flex-wrap justify-center gap-3 mt-8 w-full z-30 px-2 sm:px-4">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="glass p-3 rounded-xl border border-surface-border flex items-center gap-2 shadow-sm backdrop-blur-md bg-white/40 dark:bg-black/20 flex-1 justify-center min-w-[130px] max-w-[200px]"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-500/10 dark:bg-brand-500/20 flex items-center justify-center text-brand-700 dark:text-brand-400">
                <FiSmartphone size={16} />
              </div>
              <div className="text-xs font-bold text-text-primary whitespace-nowrap">
                {t('hero.mobile_dev')}
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="glass p-3 rounded-xl border border-surface-border flex items-center gap-2 shadow-sm backdrop-blur-md bg-white/40 dark:bg-black/20 flex-1 justify-center min-w-[130px] max-w-[200px]"
            >
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center text-violet-700 dark:text-violet-400">
                <FiCpu size={16} />
              </div>
              <div className="text-xs font-bold text-text-primary whitespace-nowrap">
                {t('hero.flutter_expert')}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
