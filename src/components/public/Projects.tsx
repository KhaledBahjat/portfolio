'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { FiGithub, FiExternalLink, FiSearch, FiX } from 'react-icons/fi';
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
  const { t, language } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    getProjects()
      .then((data) => setProjects(data.length ? data : demoProjects))
      .catch(() => setProjects(demoProjects))
      .finally(() => setLoading(false));
  }, []);

  const allTechs = ['All', ...Array.from(new Set(projects.flatMap((p) => p.techStack)))];

  const filtered = projects.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === 'All' || p.techStack.some(t => t.toLowerCase() === activeFilter.toLowerCase());
    return matchSearch && matchFilter;
  });

  const toggleTechFilter = (tech: string) => {
    if (activeFilter.toLowerCase() === tech.toLowerCase()) {
      setActiveFilter('All');
    } else {
      setActiveFilter(tech);
      // Scroll to projects section if needed
      const element = document.getElementById('projects');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

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

        {/* Search + filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <FiSearch className={`absolute ${language === 'en' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-text-secondary`} size={16} />
            <input
              type="text"
              placeholder={t('projects.search_placeholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full ${language === 'en' ? 'pl-10 pr-4' : 'pr-10 pl-4'} py-2.5 rounded-xl bg-surface-card border border-surface-border text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-blue-500/50 transition-all text-sm`}
            />
            {search && (
              <button 
                onClick={() => setSearch('')} 
                className={`absolute ${language === 'en' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary`}
              >
                <FiX size={14} />
              </button>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {allTechs.slice(0, 8).map((tech) => (
              <motion.button
                key={tech}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(tech)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all shadow-sm ${
                  activeFilter === tech
                    ? 'bg-brand-600 border-brand-600 text-white shadow-glow'
                    : 'bg-surface-card/50 dark:bg-transparent border-surface-border text-text-secondary hover:border-brand-500/50 hover:text-brand-600 dark:hover:text-brand-400'
                }`}
              >
                {tech === 'All' ? t('projects.all') : tech}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <ProjectSkeleton key={i} />)
            : filtered.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-300 group shadow-[0_4px_20px_rgb(0,0,0,0.04)] dark:shadow-none hover:shadow-xl dark:hover:shadow-blue-500/5"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-900/50 to-violet-900/50 overflow-hidden">
                    {project.images?.[0] ? (
                      <Image src={project.images[0]} alt={project.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl">📱</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                          className="p-2 glass rounded-lg text-text-primary hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          <FiGithub size={16} />
                        </a>
                      )}
                      {project.demoUrl && (
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                          className="p-2 glass rounded-lg text-text-primary hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          <FiExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>

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
                        <motion.button
                          key={tech}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTechFilter(tech);
                          }}
                          className={`text-[10px] px-2.5 py-1 rounded-lg border bg-gradient-to-br font-bold transition-all shadow-sm flex items-center gap-1.5 ${getTechColor(tech)} ${
                            activeFilter.toLowerCase() === tech.toLowerCase()
                              ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent'
                              : 'hover:shadow-glow-blue/20'
                          }`}
                        >
                          {tech}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
        </div>

        {filtered.length === 0 && !loading && (
          <div className="text-center py-16 text-text-secondary">
            {t('projects.no_results')}
          </div>
        )}
      </div>
    </section>
  );
}
