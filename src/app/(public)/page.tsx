'use client';

import { useEffect, useState } from 'react';
import Hero from '@/components/public/Hero';
import About from '@/components/public/About';
import Skills from '@/components/public/Skills';
import Projects from '@/components/public/Projects';
import Services from '@/components/public/Services';
import Certificates from '@/components/public/Certificates';
import Feedback from '@/components/public/Feedback';
import Experience from '@/components/public/Experience';
import Contact from '@/components/public/Contact';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import ScrollToTop from '@/components/public/ScrollToTop';
import { getSettings } from '@/services/settingsService';
import { incrementVisitorCount } from '@/services/visitorService';
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
    async function handleVisitor() {
      try {
        const lastVisit = localStorage.getItem('last_visit');
        const now = new Date().getTime();
        const oneDay = 24 * 60 * 60 * 1000;

        if (!lastVisit || now - parseInt(lastVisit) > oneDay) {
          await incrementVisitorCount();
          localStorage.setItem('last_visit', now.toString());
        }
      } catch (error) {
        console.error('Failed to update visitor count', error);
      }
    }

    loadSettings();
    handleVisitor();
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
        <Certificates />
        <Experience />
        <Feedback />
        <Contact settings={settings} />
      </main>

      <Footer settings={settings} />
      <ScrollToTop />
    </div>
  );
}
