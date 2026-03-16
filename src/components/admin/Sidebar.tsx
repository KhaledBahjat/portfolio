'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiHome, FiGrid, FiAward, FiBriefcase, FiMail, FiSettings, FiLogOut, FiExternalLink, FiX, FiLayers 
} from 'react-icons/fi';
import { supabase } from '@/lib/supabase/supabase';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  { label: 'Dashboard', href: '/admin', icon: FiHome },
  { label: 'Projects', href: '/admin/projects', icon: FiGrid },
  { label: 'Skills', href: '/admin/skills', icon: FiAward },
  { label: 'Skill Categories', href: '/admin/categories', icon: FiLayers },
  { label: 'Experience', href: '/admin/experience', icon: FiBriefcase },
  { label: 'Messages', href: '/admin/messages', icon: FiMail },
  { label: 'Settings', href: '/admin/settings', icon: FiSettings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-6 flex items-center justify-between">
        <Link href="/admin" onClick={onClose} className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-mono font-bold shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
            K
          </div>
          <span className="font-bold text-xl gradient-text">Portfolio Admin</span>
        </Link>
        <button onClick={onClose} className="lg:hidden p-2 text-text-secondary hover:text-text-primary transition-colors">
          <FiX size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2 py-4">
        {menuItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                active
                  ? 'bg-blue-600/10 dark:bg-blue-600/20 text-blue-700 dark:text-blue-400 border border-blue-500/20 shadow-sm shadow-blue-500/5'
                  : 'text-text-secondary hover:text-blue-700 dark:hover:text-blue-400 hover:bg-surface-border/30 dark:hover:bg-blue-500/5'
              }`}
            >
              <item.icon size={20} className={active ? 'text-blue-600 dark:text-blue-400' : 'group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-surface-border space-y-2">
        <a
          href="/"
          target="_blank"
          className="flex items-center justify-between px-4 py-3 rounded-xl text-text-secondary hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10 transition-all group"
        >
          <div className="flex items-center gap-3">
            <FiExternalLink size={20} />
            <span className="font-medium text-sm">View Portfolio</span>
          </div>
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:text-red-500 hover:bg-red-500/10 transition-all"
        >
          <FiLogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 glass border-r border-surface-border hidden lg:flex flex-col z-40">
        {SidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 glass border-r border-surface-border z-[60] lg:hidden flex flex-col"
            >
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
