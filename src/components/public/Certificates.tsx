'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { FiAward, FiExternalLink, FiX, FiZoomIn } from 'react-icons/fi';
import { getCertificates } from '@/services/certificateService';
import { Certificate } from '@/types';

export default function Certificates() {
  const [items, setItems] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getCertificates();
        setItems(data);
      } catch (error) {
        console.error('Failed to load certificates', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Prevent scroll when lightbox is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  if (!isLoading && items.length === 0) return null;

  return (
    <section id="certificates" className="py-24 relative overflow-hidden" ref={ref}>
      {/* Background Decor */}
      <div className="absolute top-1/4 -right-24 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] -z-10" />
      
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-blue-500 font-mono text-xs uppercase tracking-widest font-bold">Certifications</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mt-2">
            Skill <span className="gradient-text">Verification</span>
          </h2>
          <p className="text-text-secondary mt-4 max-w-xl mx-auto text-lg">
            A curated collection of professional certifications and advanced courses I've completed to master my craft.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            [1, 2, 3].map((n) => (
              <div key={n} className="glass rounded-3xl p-4 h-96 animate-shimmer bg-surface-loading/10" />
            ))
          ) : (
            items.map((cert, i) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
                whileHover={{ y: -10, rotate: 1 }}
                onClick={() => setSelectedImage(cert.image)}
                className="group relative glass rounded-3xl border border-surface-border hover:border-blue-500/30 transition-all duration-500 overflow-hidden cursor-pointer"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900/50">
                  <motion.img 
                    src={cert.image} 
                    alt={cert.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <FiZoomIn size={24} className="text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 shadow-lg shadow-blue-500/10">
                      <FiAward size={20} />
                    </div>
                    <span className="text-xs font-mono font-bold text-blue-500/80 uppercase tracking-widest">{cert.platform}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-text-primary mb-2 leading-tight group-hover:text-blue-500 transition-colors duration-300">
                    {cert.name}
                  </h3>
                  <p className="text-text-secondary text-sm font-medium mb-6 line-clamp-2">
                    {cert.courseName}
                  </p>
                  
                  <div className="pt-6 border-t border-surface-border/50 flex items-center justify-between text-[11px] text-text-muted font-bold font-mono uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                      {cert.instructorName}
                    </span>
                    <FiExternalLink className="opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 text-blue-500" size={16} />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Lightbox / Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-black/90 backdrop-blur-sm cursor-zoom-out"
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-8 right-8 text-white p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <FiX size={32} />
            </motion.button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-6xl w-full max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedImage} 
                alt="Certificate Full View" 
                className="w-full h-full object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
