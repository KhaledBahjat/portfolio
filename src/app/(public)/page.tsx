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
        const deviceId = localStorage.getItem('portfolio_device_id');

        if (!deviceId) {
          // Generate a unique device ID
          const newDeviceId = typeof crypto !== 'undefined' && crypto.randomUUID 
            ? crypto.randomUUID() 
            : `dev_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
          
          await incrementVisitorCount();
          localStorage.setItem('portfolio_device_id', newDeviceId);
          
          // Optionally clean up the old 'last_visit' if it exists
          localStorage.removeItem('last_visit');
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
