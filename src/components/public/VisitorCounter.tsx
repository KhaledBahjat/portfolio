'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiTrendingUp } from 'react-icons/fi';
import { getVisitorCount } from '@/services/visitorService';

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCount() {
      try {
        const currentCount = await getVisitorCount();
        setCount(currentCount);
      } catch (error) {
        console.error('Failed to load visitor count');
      } finally {
        setLoading(false);
      }
    }

    fetchCount();
    
    // Refresh count occasionally or on focus could be added here
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 h-8 px-3 rounded-full bg-surface-dark/50 border border-surface-border animate-pulse">
        <div className="w-4 h-4 rounded-full bg-slate-400/20" />
        <div className="w-12 h-3 rounded bg-slate-400/10" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group relative flex items-center gap-2 px-4 py-2 rounded-2xl glass border border-surface-border hover:border-blue-500/30 transition-all shadow-sm"
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
        <FiUsers size={16} />
      </div>
      
      <div className="flex flex-col">
        <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold leading-none mb-0.5">
          Total Visitors
        </span>
        <div className="flex items-center gap-1.5">
          <AnimatePresence mode="wait">
            <motion.span
              key={count}
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -5, opacity: 0 }}
              className="text-sm font-black text-text-primary font-mono"
            >
              {count?.toLocaleString() || '0'}
            </motion.span>
          </AnimatePresence>
          <FiTrendingUp size={10} className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      
      {/* Subtle background glow on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/5 to-violet-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
}
