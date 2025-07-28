'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaChartLine } from 'react-icons/fa';

export default function NavBar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <div className="w-full flex justify-center pt-6 px-4 fixed top-0 z-50">
      <nav className="bg-[#2A3B4C]/20 backdrop-blur-md border border-[#4A5B6C]/30 rounded-2xl shadow-lg max-w-3xl w-full px-4">
        <div className="flex justify-between h-14 items-center">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-white"
            >
              <FaChartLine className="h-5 w-5 text-[#8A9B9C]" />
              <span className="text-lg font-semibold text-white">
                StockUP
              </span>
            </Link>
            <div className="hidden sm:flex sm:space-x-4">
              <Link
                href="/stock-prediction"
                className={`px-3 py-1 rounded-lg transition-all ${
                  isActive('/stock-prediction')
                    ? 'bg-[#4A5B6C]/30 text-white'
                    : 'text-white/70 hover:text-white hover:bg-[#4A5B6C]/20'
                }`}
              >
                Predict
              </Link>
              <Link
                href="/about"
                className={`px-3 py-1 rounded-lg transition-all ${
                  isActive('/about')
                    ? 'bg-[#4A5B6C]/30 text-white'
                    : 'text-white/70 hover:text-white hover:bg-[#4A5B6C]/20'
                }`}
              >
                About
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/login"
                className="px-4 py-1.5 bg-[#4A5B6C] hover:bg-[#6A7B8C] text-white text-sm font-medium rounded-lg transition-colors"
              >
                Login
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>
    </div>
  );
} 