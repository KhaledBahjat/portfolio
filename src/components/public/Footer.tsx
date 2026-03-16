'use client';

import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import { SiCodeforces } from 'react-icons/si';
import { useLanguage } from '@/context/LanguageContext';
import { Settings } from '@/types';
import Link from 'next/link';
import VisitorCounter from './VisitorCounter';

interface FooterProps {
  settings: Settings | null;
}

export default function Footer({ settings }: FooterProps) {
  const { t, language } = useLanguage();
  const isLoading = !settings;
  const name = settings?.developerName || (isLoading ? '...' : 'Khaled');
  const siteTitle = settings?.siteTitle || (isLoading ? '...' : 'Portfolio');

  const socialLinks = settings?.socialLinks || {
    github: '',
    linkedin: '',
    codeforces: '',
    email: '',
  };

  return (
    <footer className="py-12 border-t border-surface-border glass mt-20">
      <div className="container mx-auto px-6">
        <div className={`flex flex-col ${language === 'en' ? 'md:flex-row' : 'md:flex-row-reverse'} justify-between items-center gap-8`}>
          <div className={`text-center ${language === 'en' ? 'md:text-left' : 'md:text-right'}`}>
            <h4 className="text-2xl font-black gradient-text mb-2">{siteTitle.split(' ')[0]}</h4>
            <p className="text-text-secondary text-sm max-w-xs transition-opacity hover:opacity-100 opacity-80">
              {t('footer.designed_built')} <span className="text-blue-600 dark:text-blue-500 font-bold">{name}</span>
            </p>
          </div>

          <div className={`flex items-center gap-6 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
            {socialLinks.github && (
              <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl glass border border-surface-border text-text-secondary hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/50 transition-all shadow-glow-hover">
                <FiGithub size={20} />
              </a>
            )}
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl glass border border-surface-border text-[#0077b5] dark:text-[#00a0dc] hover:border-[#0077b5]/50 transition-all shadow-glow-hover">
                <FiLinkedin size={20} />
              </a>
            )}
            {socialLinks.codeforces && (
              <a href={socialLinks.codeforces} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl glass border border-surface-border text-[#ff3333] hover:border-[#ff3333]/50 transition-all shadow-glow-hover">
                <SiCodeforces size={20} />
              </a>
            )}
            {socialLinks.email && (
              <a href={`mailto:${socialLinks.email}`} className="p-3 rounded-xl glass border border-surface-border text-blue-600 dark:text-blue-400 hover:border-blue-500/50 transition-all shadow-glow-hover">
                <FiMail size={20} />
              </a>
            )}
          </div>
        </div>

        <div className={`mt-12 pt-8 border-t border-surface-border/30 flex flex-col ${language === 'en' ? 'md:flex-row' : 'md:flex-row-reverse'} justify-between items-center gap-6`}>
          <div className="flex flex-col md:flex-row items-center gap-6 text-[10px] text-text-secondary font-mono uppercase tracking-widest opacity-60">
            <p dir="ltr">© {new Date().getFullYear()} {name}. {t('footer.rights')}</p>
            <div className={`flex items-center gap-6 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <Link href="/admin/login" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors">{t('footer.admin_login')}</Link>
              <span className="opacity-30">|</span>
              <span>{t('footer.built_with')} Next.js & Supabase</span>
            </div>
          </div>
          
          <VisitorCounter />
        </div>
      </div>
    </footer>
  );
}
