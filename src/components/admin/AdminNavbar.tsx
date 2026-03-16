'use client';

import { useAuth } from '@/context/AuthContext';
import { FiBell, FiSearch, FiUser, FiMenu } from 'react-icons/fi';
import ThemeToggle from '@/components/ThemeToggle';

interface AdminNavbarProps {
  onMenuClick: () => void;
}

export default function AdminNavbar({ onMenuClick }: AdminNavbarProps) {
  const { user } = useAuth();

  return (
    <header className="h-16 glass border-b border-surface-border sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-[0_1px_10px_rgb(0,0,0,0.02)]">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10 transition-all"
        >
          <FiMenu size={20} />
        </button>

        <div className="relative max-w-md w-full hidden md:block">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
          <input
            type="text"
            placeholder="Search everything..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-dark border border-surface-border text-text-primary placeholder-text-secondary/60 transition-all text-sm focus:bg-white dark:focus:bg-surface-dark"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <ThemeToggle />
        
        <button className="p-2 rounded-lg text-text-secondary hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10 transition-all relative hidden xs:block">
          <FiBell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-surface-dark" />
        </button>

        <div className="h-8 w-px bg-surface-border mx-1 hidden sm:block" />

        <div className="flex items-center gap-2 sm:gap-3 pl-1 sm:pl-2">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold text-text-primary truncate max-w-[120px]">{user?.user_metadata?.full_name || 'Admin'}</p>
            <p className="text-[10px] text-text-secondary truncate max-w-[120px]">{user?.email}</p>
          </div>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold shadow-blue-500/20 shadow-lg text-sm sm:text-base">
            {user?.user_metadata?.full_name ? user.user_metadata.full_name[0] : <FiUser />}
          </div>
        </div>
      </div>
    </header>
  );
}
