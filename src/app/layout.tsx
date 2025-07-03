import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../contexts/AuthContent';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FitCheck - AI-Powered Style Assistant',
  description: 'Transform your wardrobe with AI-powered outfit recommendations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}