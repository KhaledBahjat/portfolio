'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AuthGuard from '@/components/admin/AuthGuard';
import { Toaster } from 'react-hot-toast';
import { FiMenu } from 'react-icons/fi';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isLoginPage) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-surface-dark flex items-center justify-center">
          {children}
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-surface-dark flex">
        {/* Sidebar for Desktop */}
        <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        
        <div className="flex-1 flex flex-col lg:ml-64 transition-all duration-300">
          <AdminNavbar onMenuClick={() => setIsMobileMenuOpen(true)} />
          
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              {children}
            </div>
          </main>
          
          <footer className="py-6 px-8 border-t border-surface-border text-center text-slate-600 text-sm">
            Admin Panel &copy; {new Date().getFullYear()} Khaled Portfolio
          </footer>
        </div>
      </div>
    </AuthGuard>
  );
}
