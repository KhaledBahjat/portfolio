'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { getSkills } from '@/services/skillService';
import { getCategories } from '@/services/categoryService';
import { Skill } from '@/types';

const categoryMeta: Record<string, { badge: string; chip: string; glow: string; icon: string }> = {
  Languages: { badge: 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400', chip: 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400 hover:border-blue-400/50 hover:shadow-[0_0_0_1px_rgba(96,165,250,0.25)]', glow: 'shadow-blue-500/10', icon: '⌘' },
  Frameworks: { badge: 'bg-violet-500/10 border-violet-500/20 text-violet-700 dark:text-violet-400', chip: 'bg-violet-500/10 border-violet-500/20 text-violet-700 dark:text-violet-400 hover:border-violet-400/50 hover:shadow-[0_0_0_1px_rgba(167,139,250,0.25)]', glow: 'shadow-violet-500/10', icon: '⚛' },
  Databases: { badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400', chip: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400 hover:border-emerald-400/50 hover:shadow-[0_0_0_1px_rgba(52,211,153,0.25)]', glow: 'shadow-emerald-500/10', icon: '◫' },
  'Local Storage': { badge: 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400', chip: 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400 hover:border-amber-400/50 hover:shadow-[0_0_0_1px_rgba(251,191,36,0.25)]', glow: 'shadow-amber-500/10', icon: '⬢' },
  Tools: { badge: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-700 dark:text-cyan-400', chip: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-700 dark:text-cyan-400 hover:border-cyan-400/50 hover:shadow-[0_0_0_1px_rgba(34,211,238,0.25)]', glow: 'shadow-cyan-500/10', icon: '✦' },
};

const defaultColors = { badge: 'bg-slate-500/10 border-slate-500/20 text-slate-700 dark:text-slate-400', chip: 'bg-slate-500/10 border-slate-500/20 text-slate-700 dark:text-slate-400 hover:border-slate-400/50 hover:shadow-[0_0_0_1px_rgba(148,163,184,0.25)]', glow: 'shadow-slate-500/10', icon: '•' };

const normalizeCategory = (value: string) => {
  const normalized = value?.toLowerCase() ?? '';
  if (normalized.includes('lang') || normalized.includes('program') || normalized.includes('code')) return 'Languages';
  if (normalized.includes('framework') || normalized.includes('frontend') || normalized.includes('ui')) return 'Frameworks';
  if (normalized.includes('database') || normalized.includes('db') || normalized.includes('sql')) return 'Databases';
  if (normalized.includes('local') || normalized.includes('storage') || normalized.includes('hive') || normalized.includes('shared')) return 'Local Storage';
  return 'Tools';
};

export default function Skills() {
  const { t } = useLanguage();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [skillsData] = await Promise.all([
          getSkills(),
          getCategories()
        ]);
        setSkills(skillsData);
      } catch (error) {
        console.error('Failed to load data', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const visibleSkills = skills.filter((skill) => skill.isVisible !== false);

  const groupedSkills = visibleSkills.reduce((acc: Record<string, Skill[]>, skill) => {
    const catName = normalizeCategory(skill.category || 'Tools');
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(skill);
    return acc;
  }, {});

  const orderedCategoryNames = Object.keys(groupedSkills).sort((a, b) => {
    const order = ['Languages', 'Frameworks', 'Databases', 'Local Storage', 'Tools'];
    const aIndex = order.indexOf(a);
    const bIndex = order.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return (
    <section id="skills" className="py-24 bg-surface-card/30" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-brand-600 dark:text-brand-400 font-mono text-sm uppercase tracking-widest block mb-4">{'// 02. skills'}</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 text-text-primary tracking-tight">
            {t('skills.title')} <span className="gradient-text">{t('skills.subtitle')}</span>
          </h2>
          <p className="text-text-secondary mt-4 max-w-xl mx-auto text-lg leading-relaxed">
            {t('skills.description')}
          </p>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.08 }
            }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: '-50px' }}
          className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
        >
          {isLoading ? (
            [1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="glass rounded-2xl p-6 animate-shimmer border border-surface-border/70">
                <div className="w-24 h-6 bg-surface-loading rounded-full mb-5" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="h-9 w-20 bg-surface-loading rounded-full" />
                  ))}
                </div>
              </div>
            ))
          ) : (
            orderedCategoryNames.map((catName) => {
              const catSkills = groupedSkills[catName] || [];
              if (catSkills.length === 0) return null;

              const colors = categoryMeta[catName] || defaultColors;

              return (
                <motion.div
                  key={catName}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    visible: { opacity: 1, y: [24, -4, 0], transition: { duration: 0.55 } }
                  }}
                  whileHover={{ y: -4, scale: 1.01, boxShadow: '0 24px 60px rgba(15, 23, 42, 0.16)' }}
                  className={`glass rounded-2xl border p-6 transition-all duration-300 shadow-[0_12px_40px_rgba(15,23,42,0.08)] dark:shadow-none hover:shadow-xl dark:hover:shadow-blue-500/10 ${colors.glow}`}
                >
                  <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] ${colors.badge}`}>
                    <span className="text-sm leading-none">{colors.icon}</span>
                    <span>{catName}</span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {catSkills.map((skill) => (
                      <motion.div
                        key={skill.id}
                        whileHover={{ y: -2, scale: 1.02 }}
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-all duration-200 ${colors.chip}`}
                      >
                        <span className="text-base leading-none">{skill.icon}</span>
                        <span>{skill.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>
    </section>
  );
}
