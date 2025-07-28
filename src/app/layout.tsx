import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NavBar from './NavBar';
import GradientBackground from '@/components/GradientBackground';
import { Providers } from './providers';
import { AnimatePresence } from 'framer-motion';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Stock Market Predictor',
  description: 'Advanced stock market prediction using neural networks',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-transparent`}>
        <Providers>
          <GradientBackground />
          {/* Noise layers applied immediately */}
          <div className="noise-layer noise-layer-1" />
          <div className="noise-layer noise-layer-2" />
          <div className="noise-layer noise-layer-3" />
          <div className="min-h-screen bg-transparent backdrop-blur-sm relative flex flex-col">
            <NavBar />
            <main className="flex-1 relative z-10 pt-24 px-4">
              <AnimatePresence mode="wait">
                {children}
              </AnimatePresence>
            </main>
            {/* Glassmorphism Footer */}
            <footer className="relative z-10 mt-auto">
              <div className="w-full flex justify-center pb-6 px-4">
                <div className="bg-[#2A3B4C]/20 backdrop-blur-md border border-[#4A5B6C]/30 rounded-2xl shadow-lg max-w-3xl w-full px-6 py-4">
                  <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                    <div className="mb-4 md:mb-0">
                      <p className="text-white font-semibold">StockUP</p>
                      <p className="text-gray-300 text-sm">AI-Powered Market Predictions</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 text-sm">
                      <a href="/about" className="text-gray-300 hover:text-white transition-colors">
                        About
                      </a>
                      <a href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                        Privacy
                      </a>
                      <a href="/terms" className="text-gray-300 hover:text-white transition-colors">
                        Terms
                      </a>
                      <span className="text-gray-400">© 2025 Codavra</span>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
