'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { FiGithub, FiExternalLink, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { getProjects } from '@/services/projectService';
import { Project } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';

// Skeleton card for loading state
function ProjectSkeleton() {
  return (
    <div className="glass rounded-2xl overflow-hidden animate-shimmer shadow-sm">
      <div className="h-48 w-full bg-surface-loading/50" />
      <div className="p-6">
        <div className="h-6 w-3/4 bg-surface-loading/50 rounded mb-3" />
        <div className="h-4 w-full bg-surface-loading/50 rounded mb-2" />
        <div className="h-4 w-2/3 bg-surface-loading/50 rounded mb-4" />
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-surface-loading/50 rounded-full" />
          <div className="h-6 w-20 bg-surface-loading/50 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// Helper to get color for tech badges
const getTechColor = (tech: string) => {
  const t = tech.toLowerCase();
  if (t.includes('flutter')) return 'from-blue-600/20 to-blue-400/20 text-blue-600 dark:text-blue-400 border-blue-500/30';
  if (t.includes('dart')) return 'from-blue-700/20 to-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-600/30';
  if (t.includes('firebase')) return 'from-amber-600/20 to-amber-400/20 text-amber-600 dark:text-amber-400 border-amber-500/30';
  if (t.includes('react') || t.includes('next')) return 'from-cyan-600/20 to-cyan-400/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/30';
  if (t.includes('node')) return 'from-emerald-600/20 to-emerald-400/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
  if (t.includes('supabase') || t.includes('postgres')) return 'from-emerald-700/20 to-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-600/30';
  if (t.includes('type') || t.includes('js')) return 'from-indigo-600/20 to-indigo-400/20 text-indigo-600 dark:text-indigo-400 border-indigo-500/30';
  if (t.includes('api') || t.includes('rest')) return 'from-violet-600/20 to-violet-400/20 text-violet-600 dark:text-violet-400 border-violet-500/30';
  if (t.includes('stripe') || t.includes('pay')) return 'from-purple-600/20 to-purple-400/20 text-purple-600 dark:text-purple-400 border-purple-500/30';
  if (t.includes('auth')) return 'from-rose-600/20 to-rose-400/20 text-rose-600 dark:text-rose-400 border-rose-500/30';
  
  return 'from-slate-600/10 to-slate-400/10 text-text-secondary border-surface-border';
};

function ProjectImageSlider({ project }: { project: Project }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = project.images || [];

  useEffect(() => {
    if (images.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [images.length, isHovered]);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(index);
  };

  return (
    <div 
      className="relative h-48 bg-gradient-to-br from-blue-900/50 to-violet-900/50 overflow-hidden group/slider"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {images.length > 0 ? (
        <div className="relative w-full h-full">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image src={images[currentIndex]} alt={`${project.title} - image ${currentIndex + 1}`} fill className="object-cover" />
            </motion.div>
          </AnimatePresence>

          {images.length > 1 && (
            <>
              {/* Navigation Arrows */}
              <button 
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/30 text-white opacity-0 group-hover/slider:opacity-100 hover:bg-black/50 transition-all z-10"
                aria-label="Previous image"
              >
                <FiChevronLeft size={18} />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/30 text-white opacity-0 group-hover/slider:opacity-100 hover:bg-black/50 transition-all z-10"
                aria-label="Next image"
              >
                <FiChevronRight size={18} />
              </button>

              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => goToImage(e, idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex ? 'w-4 bg-blue-500' : 'w-1.5 bg-white/50 hover:bg-white/80 shadow-[0_0_2px_rgba(0,0,0,0.5)]'
                    }`}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-4xl">📱</span>
        </div>
      )}
      
      {/* Overlay & Links */}
      <div className="absolute inset-0 bg-gradient-to-t from-surface-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
             className="p-2 glass rounded-lg text-text-primary hover:text-blue-600 dark:hover:text-blue-400 transition-colors pointer-events-auto">
            <FiGithub size={16} />
          </a>
        )}
        {project.demoUrl && (
          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
             className="p-2 glass rounded-lg text-text-primary hover:text-blue-600 dark:hover:text-blue-400 transition-colors pointer-events-auto">
            <FiExternalLink size={16} />
          </a>
        )}
      </div>
    </div>
  );
}

// Fallback demo projects
const demoProjects: Project[] = [
  {
    id: 'demo1',
    title: 'Flutter E-Commerce App',
    description: 'A full-featured e-commerce mobile app built with Flutter and Firebase.',
    techStack: ['Flutter', 'Dart', 'Firebase', 'Stripe'],
    githubUrl: 'https://github.com/',
    demoUrl: '',
    images: [],
    category: 'Flutter',
    featured: true,
  },
  {
    id: 'demo2',
    title: 'Todo App with Hive',
    description: 'A beautiful task manager with local persistence using Hive.',
    techStack: ['Flutter', 'Dart', 'Hive'],
    githubUrl: 'https://github.com/',
    demoUrl: '',
    images: [],
    category: 'Flutter',
    featured: false,
  },
  {
    id: 'demo3',
    title: 'REST API Integration',
    description: 'Weather app consuming REST APIs with state management.',
    techStack: ['Flutter', 'REST API', 'Provider'],
    githubUrl: 'https://github.com/',
    demoUrl: '',
    images: [],
    category: 'Flutter',
    featured: false,
  },
];

export default function Projects() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then((data) => setProjects(data.length ? data : demoProjects))
      .catch(() => setProjects(demoProjects))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="projects" className="py-24" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-blue-600 dark:text-blue-400 font-mono text-sm uppercase tracking-widest">// 03. projects</span>
          <h2 className="text-4xl font-bold mt-2 text-text-primary">
            {t('projects.title')} <span className="gradient-text">{t('projects.subtitle')}</span>
          </h2>
          <p className="text-text-secondary mt-3 max-w-xl mx-auto">
            {t('projects.description')}
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <ProjectSkeleton key={i} />)
            : projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  variants={{
                    hidden: { opacity: 0, scale: 0.95, y: 30 },
                    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } }
                  }}
                  whileHover={{ y: -8, borderColor: 'rgba(59, 130, 246, 0.4)' }}
                  className="glass rounded-3xl overflow-hidden hover:-translate-y-2 transition-all duration-300 group shadow-[0_4px_20px_rgb(0,0,0,0.04)] dark:shadow-none hover:shadow-xl dark:hover:shadow-blue-500/10 border border-surface-border"
                >
                  {/* Image Slider */}
                  <ProjectImageSlider project={project} />

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-text-primary">{project.title}</h3>
                      {project.featured && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 ml-2 shrink-0">
                          {t('projects.featured')}
                        </span>
                      )}
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed mb-4 line-clamp-3 font-medium">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className={`text-[10px] px-2.5 py-1 rounded-lg border bg-gradient-to-br font-bold shadow-sm flex items-center gap-1.5 ${getTechColor(tech)}`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
        </motion.div>

        {projects.length === 0 && !loading && (
          <div className="text-center py-16 text-text-secondary">
            {t('projects.no_results')}
          </div>
        )}
      </div>
    </section>
  );
}
