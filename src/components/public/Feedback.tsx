'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { FiMessageSquare, FiChevronLeft, FiChevronRight, FiUser } from 'react-icons/fi';
import { FaQuoteLeft } from 'react-icons/fa';
import { getFeedback } from '@/services/feedbackService';
import { Feedback as FeedbackType } from '@/types';

export default function Feedback() {
  const [items, setItems] = useState<FeedbackType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [direction, setDirection] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-100px' });

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getFeedback();
        setItems(data);
      } catch (error) {
        console.error('Failed to load feedback', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [items]);

  const next = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };
  const prev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.9,
    }),
  };

  if (!isLoading && items.length === 0) return null;

  return (
    <section id="feedback" className="py-24 relative overflow-hidden" ref={ref}>
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-violet-600/5 rounded-full blur-[100px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] -z-10" />

      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 mb-4">
            <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-violet-500 font-mono text-xs uppercase tracking-widest font-bold">Testimonials</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mt-2">
            Client <span className="gradient-text text-violet-500 font-extrabold italic">Feedback</span>
          </h2>
          <p className="text-text-secondary mt-4 max-w-xl mx-auto text-lg leading-relaxed">
            Kind words from visionary clients and valued partners I've had the professional pleasure of collaborating with.
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto px-4 md:px-0">
          {isLoading ? (
            <div className="glass rounded-[3rem] p-12 h-[500px] animate-shimmer bg-surface-loading/10" />
          ) : (
            <div className="relative">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: '0 20px 40px -15px rgba(139, 92, 246, 0.25)',
                    borderColor: 'rgba(139, 92, 246, 0.4)'
                  }}
                  transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.4 },
                    scale: { duration: 0.4 },
                    boxShadow: { duration: 0.3 },
                    borderColor: { duration: 0.3 }
                  }}
                  className="glass rounded-[3rem] p-8 md:p-16 border border-surface-border flex flex-col lg:flex-row items-center gap-10 md:gap-16 relative overflow-hidden backdrop-blur-xl cursor-default"
                >
                  {/* Decorative Elements */}
                  <div className="absolute -top-6 -left-6 text-violet-500/10 dark:text-violet-500/5 -z-10 rotate-12">
                    <FaQuoteLeft size={180} />
                  </div>
                  
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 3 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="w-56 h-56 md:w-80 md:h-80 shrink-0 relative z-10"
                  >
                    <div className="w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-violet-500/20 p-2 bg-gradient-to-br from-violet-500/20 to-transparent border border-white/10">
                      <img 
                        src={items[currentIndex].image} 
                        alt={items[currentIndex].name} 
                        className="w-full h-full object-cover rounded-[2rem]" 
                      />
                    </div>
                    {/* Badge */}
                    <div className="absolute -bottom-4 -right-4 bg-violet-600 text-white p-4 rounded-2xl shadow-xl shadow-violet-600/30">
                      <FiUser size={24} />
                    </div>
                  </motion.div>

                  <div className="flex-1 text-center lg:text-left relative z-10">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="mb-8"
                    >
                      <h3 className="text-3xl md:text-4xl font-bold text-text-primary mb-2 tracking-tight">
                        {items[currentIndex].name}
                      </h3>
                      {items[currentIndex].role && (
                        <p className="text-sm md:text-base font-mono font-bold text-violet-500 uppercase tracking-[0.2em]">
                          {items[currentIndex].role}
                        </p>
                      )}
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className="flex items-center gap-6 justify-center lg:justify-start"
                    >
                      <div className="w-16 h-1.5 bg-gradient-to-r from-violet-600 to-transparent rounded-full" />
                      <div className="bg-violet-500/10 p-4 rounded-2xl">
                        <FiMessageSquare size={28} className="text-violet-500" />
                      </div>
                      <div className="w-16 h-1.5 bg-gradient-to-l from-violet-600 to-transparent rounded-full hidden md:block" />
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Controls */}
              {items.length > 1 && (
                <div className="flex justify-center md:justify-end gap-4 mt-12 relative z-20">
                  <motion.button
                    whileHover={{ scale: 1.1, x: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={prev}
                    className="group p-5 rounded-[1.5rem] border border-surface-border glass text-text-secondary hover:text-violet-500 hover:border-violet-500/40 transition-all duration-300 shadow-lg"
                  >
                    <FiChevronLeft size={28} className="group-hover:translate-x-[-2px] transition-transform" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, x: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={next}
                    className="group p-5 rounded-[1.5rem] border border-surface-border glass text-text-secondary hover:text-violet-500 hover:border-violet-500/40 transition-all duration-300 shadow-lg"
                  >
                    <FiChevronRight size={28} className="group-hover:translate-x-[2px] transition-transform" />
                  </motion.button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
