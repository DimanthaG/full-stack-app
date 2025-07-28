'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { FaChartLine, FaCog } from 'react-icons/fa';

export default function NavBar() {
  const pathname = usePathname();
  const { data: session } = useSession();
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
              <FaChartLine className="h-5 w-5 text-[#white]" />
              <span className="text-lg font-semibold text-white">
                StockUP
              </span>
            </Link>
            <div className="hidden sm:flex sm:space-x-4">
              {session && (
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
              )}
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
              {session?.user?.role === "admin" && (
                <Link
                  href="/admin"
                  className={`px-3 py-1 rounded-lg transition-all ${
                    isActive('/admin') || pathname.startsWith('/admin/')
                      ? 'bg-[#4A5B6C]/30 text-white'
                      : 'text-white/70 hover:text-white hover:bg-[#4A5B6C]/20'
                  }`}
                >
                  <FaCog className="w-4 h-4 inline mr-1" />
                  Admin
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {session ? (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-white/70 text-sm px-3">
                    {session.user?.name || session.user?.email}
                  </span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="px-4 py-1.5 bg-[#4A5B6C] hover:bg-[#6A7B8C] text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/register"
                    className="px-4 py-1.5 bg-[#2A3B4C]/50 hover:bg-[#4A5B6C]/20 border border-[#4A5B6C] text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Sign Up
                  </Link>
                </motion.div>
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
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
} 