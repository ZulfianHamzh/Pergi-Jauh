// src/app/layout.js
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers'; // Import Providers

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Pergi Jauh',
  description: 'A React-Tailwind app with admin panel',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers> {/* Wrap with Providers */}
          {children}
        </Providers>
      </body>
    </html>
  );
}