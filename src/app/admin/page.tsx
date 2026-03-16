'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiGrid, FiAward, FiMail, FiBarChart2, FiArrowUpRight, FiClock, FiSettings } from 'react-icons/fi';
import { getProjects } from '@/services/projectService';
import { getSkills } from '@/services/skillService';
import { getMessages } from '@/services/messageService';
import { Project, Skill, Message } from '@/types';
import { formatRelative } from '@/utils/helpers';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    messages: 0,
    unread: 0,
  });
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [projData, skillData, msgData] = await Promise.all([
          getProjects(),
          getSkills(),
          getMessages(),
        ]);
        
        setStats({
          projects: projData.length,
          skills: skillData.length,
          messages: msgData.length,
          unread: msgData.filter(m => !m.read).length,
        });
        
        setRecentMessages(msgData.slice(0, 5));
      } catch (error) {
        console.error('Failed to load dashboard stats', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadStats();
  }, []);

  const statCards = [
    { label: 'Total Projects', value: stats.projects, icon: FiGrid, color: 'blue' },
    { label: 'Total Skills', value: stats.skills, icon: FiAward, color: 'violet' },
    { label: 'Messages', value: stats.messages, icon: FiMail, color: 'emerald' },
    { label: 'Unread', value: stats.unread, icon: FiBarChart2, color: 'amber' },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 glass rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary uppercase tracking-tight">Dashboard Overview</h1>
        <p className="text-text-secondary text-sm mt-1">Welcome back, here&apos;s what&apos;s happening with your portfolio.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-2xl border border-surface-border relative overflow-hidden group hover:border-blue-500/30 transition-all"
          >
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <card.icon size={100} />
            </div>
            
            <div className="flex items-center gap-4 mb-3">
              <div className={`p-3 rounded-xl bg-gradient-to-br transition-all ${
                card.color === 'blue' ? 'from-blue-600/20 to-blue-600/5 text-blue-600 dark:text-blue-400' :
                card.color === 'violet' ? 'from-violet-600/20 to-violet-600/5 text-violet-600 dark:text-violet-400' :
                card.color === 'emerald' ? 'from-emerald-600/20 to-emerald-600/5 text-emerald-600 dark:text-emerald-400' :
                'from-amber-600/20 to-amber-600/5 text-amber-600 dark:text-amber-400'
              }`}>
                <card.icon size={24} />
              </div>
              <span className="text-text-secondary text-sm font-bold">{card.label}</span>
            </div>
            
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-text-primary">{card.value}</h3>
              <div className="text-xs text-green-400 flex items-center gap-1 font-mono">
                <FiArrowUpRight />
                <span>+0%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Messages */}
        <div className="lg:col-span-2 glass rounded-2xl border border-surface-border flex flex-col overflow-hidden">
          <div className="p-6 border-b border-surface-border flex items-center justify-between">
            <h3 className="font-bold text-text-primary flex items-center gap-2">
              <FiMail className="text-emerald-600 dark:text-emerald-400" />
              Recent Messages
            </h3>
            <Link href="/admin/messages" className="text-xs text-blue-400 hover:underline">
              View all
            </Link>
          </div>
          
          <div className="flex-1 divide-y divide-surface-border">
            {recentMessages.length > 0 ? (
              recentMessages.map((msg) => (
                <div key={msg.id} className="p-4 hover:bg-white/5 transition-colors flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-dark border border-surface-border flex items-center justify-center text-slate-400 font-bold shrink-0">
                    {msg.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-text-primary truncate">{msg.name}</h4>
                      {!msg.read && <Badge variant="primary" className="shadow-lg shadow-blue-500/20">New</Badge>}
                    </div>
                    <p className="text-sm text-text-secondary truncate mb-1 font-medium">{msg.message}</p>
                    <div className="flex items-center gap-2 text-[10px] text-text-muted uppercase font-mono tracking-wider font-bold">
                      <FiClock className="text-blue-600 dark:text-blue-400" />
                      <span>{formatRelative(msg.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-slate-600 italic">
                No messages received yet.
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass rounded-2xl border border-surface-border p-6 flex flex-col shadow-sm">
          <h3 className="font-bold text-text-primary mb-6 flex items-center gap-2">
            <FiBarChart2 className="text-blue-600 dark:text-blue-400" />
            Quick Actions
          </h3>
          
          <div className="space-y-3">
            {[
              { label: 'Add New Project', href: '/admin/projects', icon: FiGrid },
              { label: 'Update Skills', href: '/admin/skills', icon: FiAward },
              { label: 'Manage Settings', href: '/admin/settings', icon: FiSettings },
            ].map(action => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 p-4 rounded-xl border border-surface-border hover:border-blue-500/30 hover:bg-blue-500/5 transition-all text-text-secondary hover:text-blue-600 dark:hover:text-blue-400 group font-bold"
              >
                <action.icon className="group-hover:scale-110 transition-transform" />
                <span className="text-sm">{action.label}</span>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex-1 flex flex-col justify-end">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-600/20 to-violet-600/20 border border-blue-500/20">
              <p className="text-text-primary text-xs font-bold mb-1">System Status</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-text-muted uppercase tracking-widest font-mono font-bold">Supabase Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
