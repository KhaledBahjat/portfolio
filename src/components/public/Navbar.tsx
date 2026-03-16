'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiGlobe } from 'react-icons/fi';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { Settings } from '@/types';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import Button from '@/components/ui/Button';

export default function Navbar({ settings }: { settings: Settings | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  
  const siteTitle = settings?.siteTitle || 'Khaled Portfolio';

  const navLinksEn = [
    { name: t('nav.home'), href: '#home' },
    { name: t('nav.about'), href: '#about' },
    { name: t('nav.skills'), href: '#skills' },
    { name: t('nav.projects'), href: '#projects' },
    { name: t('nav.experience'), href: '#experience' },
    { name: t('nav.contact'), href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'py-4 glass border-b border-surface-border' : 'py-6 bg-transparent'
    }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="relative group">
          <motion.span 
            className="text-2xl font-black gradient-text tracking-tighter"
            whileHover={{ scale: 1.05 }}
          >
            {siteTitle.split(' ')[0]}
            <span className="text-text-primary">.</span>
          </motion.span>
          <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinksEn.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-sm font-semibold text-text-secondary hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-widest group px-1 py-2"
            >
              <motion.span whileHover={{ y: -2 }} className="inline-block">
                {link.name}
              </motion.span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
          
          <div className="h-6 w-px bg-surface-border mx-2" />
          
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="glass"
                size="sm"
                onClick={toggleLanguage}
                className="gap-2 group transition-all duration-300 hover:border-blue-500/50"
              >
                <FiGlobe size={14} className="text-blue-600 dark:text-blue-400 group-hover:rotate-12 transition-transform" />
                <span>{language === 'en' ? 'العربية' : 'EN'}</span>
              </Button>
            </motion.div>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 lg:hidden">
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-xl glass border border-surface-border text-text-secondary text-xs font-bold"
          >
             {language === 'en' ? 'AR' : 'EN'}
          </button>
          
          <ThemeToggle />
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-text-primary"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass border-b border-surface-border overflow-hidden bg-surface-dark/95 backdrop-blur-2xl"
          >
            <div className="flex flex-col p-6 gap-6">
              {navLinksEn.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-xl font-bold text-text-primary hover:text-blue-400 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
