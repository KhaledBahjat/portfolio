'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { getSkills } from '@/services/skillService';
import { getCategories } from '@/services/categoryService';
import { Skill, SkillCategory } from '@/types';

const defaultCategories = ['programming', 'frameworks', 'backend', 'databases', 'tools'];

const colorMap: Record<string, { bar: string; badge: string; text: string }> = {
  programming: { bar: 'from-blue-600 to-blue-400', badge: 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400', text: 'text-blue-700 dark:text-blue-400' },
  frameworks: { bar: 'from-violet-600 to-violet-400', badge: 'bg-violet-500/10 border-violet-500/20 text-violet-700 dark:text-violet-400', text: 'text-violet-700 dark:text-violet-400' },
  backend: { bar: 'from-cyan-600 to-cyan-400', badge: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-700 dark:text-cyan-400', text: 'text-cyan-700 dark:text-cyan-400' },
  databases: { bar: 'from-emerald-600 to-emerald-400', badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400', text: 'text-emerald-700 dark:text-emerald-400' },
  tools: { bar: 'from-amber-600 to-amber-400', badge: 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400', text: 'text-amber-700 dark:text-amber-400' },
  // Fallback map for common names
  development: { bar: 'from-blue-600 to-blue-400', badge: 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400', text: 'text-blue-700 dark:text-blue-400' },
  standard: { bar: 'from-indigo-600 to-indigo-400', badge: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-700 dark:text-indigo-400', text: 'text-indigo-700 dark:text-indigo-400' },
};

const defaultColors = { bar: 'from-slate-600 to-slate-400', badge: 'bg-slate-500/10 border-slate-500/20 text-slate-700 dark:text-slate-400', text: 'text-slate-700 dark:text-slate-400' };

export default function Skills() {
  const { t } = useLanguage();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    async function loadData() {
      try {
        const [skillsData, categoriesData] = await Promise.all([
          getSkills(),
          getCategories()
        ]);
        setSkills(skillsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load data', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const groupedSkills = skills.reduce((acc: Record<string, Skill[]>, skill) => {
    const catName = skill.category;
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(skill);
    return acc;
  }, {});

  // Sort categories by orderIndex if they exist in the categories list
  const sortedCategories = [...categories].sort((a, b) => a.orderIndex - b.orderIndex);

  // Also include categories that have skills but aren't in the official list
  const extraCategoryNames = Object.keys(groupedSkills).filter(
    name => !categories.some(c => c.name === name)
  );

  return (
    <section id="skills" className="py-24 bg-surface-card/30" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-brand-600 dark:text-brand-400 font-mono text-sm uppercase tracking-widest block mb-4">// 02. skills</span>
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
              transition: { staggerChildren: 0.1 }
            }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {isLoading ? (
            [1, 2, 3].map((n) => (
              <div key={n} className="glass rounded-2xl p-6 animate-shimmer">
                <div className="w-24 h-6 bg-surface-loading rounded-full mb-6" />
                <div className="space-y-6">
                  {[1, 2, 3, 4].map((s) => (
                    <div key={s}>
                      <div className="flex justify-between mb-2">
                        <div className="w-20 h-4 bg-surface-loading rounded" />
                        <div className="w-8 h-4 bg-surface-loading rounded" />
                      </div>
                      <div className="h-1.5 bg-surface-loading rounded-full w-full" />
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <>
              {/* Official Categories */}
              {sortedCategories.map((cat, catIdx) => {
                const catSkills = groupedSkills[cat.name] || [];
                if (catSkills.length === 0) return null;

                const colors = colorMap[cat.name.toLowerCase()] || defaultColors;

                return (
                  <motion.div
                    key={cat.id}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                    }}
                    whileHover={{ y: -5, borderColor: colors.badge.split('text-')[0].replace('bg-', '') + '40' }}
                    className="glass rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 shadow-[0_4px_20px_rgb(0,0,0,0.04)] dark:shadow-none hover:shadow-xl dark:hover:shadow-blue-500/5 group border border-surface-border"
                  >
                    <div className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full border mb-5 ${colors.badge}`}>
                      {cat.icon && <span>{cat.icon}</span>}
                      {cat.name}
                    </div>
                    <div className="space-y-4">
                      {catSkills.map((skill, i) => (
                        <div key={skill.id}>
                          <div className="flex justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              {skill.icon && <span className="text-base">{skill.icon}</span>}
                              <span className="text-text-primary text-sm font-medium">{skill.name}</span>
                            </div>
                            <span className={`text-xs font-mono opacity-80 ${colors.text}`}>{skill.level}%</span>
                          </div>
                          <div className="h-1.5 bg-surface-border rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: 0.2 + i * 0.1, ease: 'easeOut' }}
                              className={`h-full rounded-full bg-gradient-to-r ${colors.bar}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}

              {/* Extra Categories (orphaned skills) */}
              {extraCategoryNames.map((catName, idx) => {
                const catSkills = groupedSkills[catName];
                const colors = colorMap[catName.toLowerCase()] || defaultColors;
                const offset = sortedCategories.length + idx;

                return (
                  <motion.div
                    key={catName}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: offset * 0.1 }}
                    className="glass rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 shadow-[0_4px_20px_rgb(0,0,0,0.04)] dark:shadow-none hover:shadow-xl dark:hover:shadow-blue-500/5 group"
                  >
                    <div className={`inline-block text-xs font-bold px-3 py-1 rounded-full border mb-5 ${colors.badge}`}>
                      {catName}
                    </div>
                    <div className="space-y-4">
                      {catSkills.map((skill, i) => (
                        <div key={skill.id}>
                          <div className="flex justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              {skill.icon && <span className="text-base">{skill.icon}</span>}
                              <span className="text-text-primary text-sm font-medium">{skill.name}</span>
                            </div>
                            <span className={`text-xs font-mono opacity-80 ${colors.text}`}>{skill.level}%</span>
                          </div>
                          <div className="h-1.5 bg-surface-border rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
                              transition={{ duration: 1, delay: offset * 0.1 + i * 0.1, ease: 'easeOut' }}
                              className={`h-full rounded-full bg-gradient-to-r ${colors.bar}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
