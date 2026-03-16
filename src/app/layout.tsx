import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Khaled | Flutter Developer",
  description:
    "Full-stack mobile developer specializing in Flutter, Firebase, and modern mobile app development.",
  keywords: ["Flutter", "Dart", "Firebase", "Mobile Developer", "Portfolio"],
  openGraph: {
    title: "Khaled | Flutter Developer",
    description: "Mobile developer portfolio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <LanguageProvider>
          <ThemeProvider>
            <AuthProvider>
              {children}
              <Toaster
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '500',
                  },
                  success: {
                    iconTheme: { primary: '#10b981', secondary: '#ffffff' },
                  },
                  error: {
                    iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
                  },
                }}
              />
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
