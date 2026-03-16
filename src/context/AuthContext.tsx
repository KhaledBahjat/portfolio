'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        console.log('✅ Supabase Auth State Changed:', {
          email: session.user.email,
          uid: session.user.id,
          adminEmailConfig: process.env.NEXT_PUBLIC_ADMIN_EMAIL
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase();
  const userEmail = user?.email?.toLowerCase();
  
  const isAdmin =
    !!user &&
    (userEmail === adminEmail ||
      userEmail?.endsWith('@admin.portfolio.com') ||
      false);

  useEffect(() => {
    if (user && !loading) {
      console.log('🛡️ Admin Check (Supabase):', {
        isAdmin,
        userEmail,
        adminEmail,
        configEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
        match: userEmail === adminEmail
      });
      
      if (!isAdmin) {
        console.warn('⚠️ User is logged in but NOT recognized as admin. Access to admin features may be restricted.');
      }
    }
  }, [user, loading, isAdmin, userEmail, adminEmail]);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
