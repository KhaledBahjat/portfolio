'use client';

import { useEffect, useState } from 'react';
import Hero from '@/components/public/Hero';
import About from '@/components/public/About';
import Skills from '@/components/public/Skills';
import Projects from '@/components/public/Projects';
import Services from '@/components/public/Services';
import Experience from '@/components/public/Experience';
import Contact from '@/components/public/Contact';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import ScrollToTop from '@/components/public/ScrollToTop';
import { getSettings } from '@/services/settingsService';
import { Settings } from '@/types';

export default function PortfolioPage() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (error) {
        console.error('Failed to load settings', error);
      }
    }
    loadSettings();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar settings={settings} />
      
      <main className="flex-grow pt-16">
        <Hero settings={settings} />
        <About settings={settings} />
        <Skills />
        <Projects />
        <Services />
        <Experience />
        <Contact settings={settings} />
      </main>

      <Footer settings={settings} />
      <ScrollToTop />
    </div>
  );
}
