'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FaChartLine, FaBrain, FaUserCircle } from 'react-icons/fa';
import PageTransition from '@/components/PageTransition';

export default function Home() {
  const { data: session } = useSession();

  const features = [
    {
      icon: <FaChartLine className="w-6 h-6" />,
      title: 'Real-Time Market Data',
      description: 'Access live stock market data and trends from reliable sources'
    },
    {
      icon: <FaBrain className="w-6 h-6" />,
      title: 'AI-Powered Analysis',
      description: 'Neural networks analyze patterns to predict market movements'
    },
    {
      icon: <FaUserCircle className="w-6 h-6" />,
      title: 'Personalized Insights',
      description: 'Track your predictions and improve your investment strategy'
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-7xl w-full py-24 sm:py-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mx-auto max-w-2xl text-center"
            >
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                StockUP: AI-Powered Market Predictions
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-200">
                Harness the power of neural networks to analyze market patterns and predict future trends.
                Make informed decisions with advanced machine learning algorithms.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href={session ? "/stock-prediction" : "/login"}
                  className="rounded-md bg-[#4A5B6C] hover:bg-[#6A7B8C] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A5B6C] transition-colors"
                >
                  Start Predicting
                </Link>
                <Link
                  href="/about"
                  className="text-sm font-semibold leading-6 text-white hover:text-[#8A9B9C] transition-colors"
                >
                  Learn more <span aria-hidden="true">→</span>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mx-auto mt-20 max-w-lg sm:mt-24 lg:mt-24 lg:max-w-4xl"
            >
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                    className="relative bg-[#2A3B4C]/20 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-[#4A5B6C]/30 text-center"
                  >
                    <div className="flex justify-center mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#4A5B6C] text-white">
                        {feature.icon}
                      </div>
                    </div>
                    <dt className="text-base font-semibold leading-7 text-white mb-2">
                      {feature.title}
                    </dt>
                    <dd className="text-base leading-7 text-gray-300">
                      {feature.description}
                    </dd>
                  </motion.div>
                ))}
              </dl>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
