'use client';

import { motion } from 'framer-motion';
import { FaChartLine, FaBrain, FaShieldAlt, FaRocket } from 'react-icons/fa';
import PageTransition from '@/components/PageTransition';

export default function About() {
  const features = [
    {
      icon: <FaBrain className="w-6 h-6" />,
      title: 'Neural Network Technology',
      description: 'Advanced machine learning algorithms analyze historical patterns to predict future market movements with high accuracy.'
    },
    {
      icon: <FaChartLine className="w-6 h-6" />,
      title: 'Real-Time Data Analysis',
      description: 'Live market data integration provides up-to-the-minute information for making informed investment decisions.'
    },
    {
      icon: <FaShieldAlt className="w-6 h-6" />,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security ensures your data and predictions remain confidential and protected.'
    },
    {
      icon: <FaRocket className="w-6 h-6" />,
      title: 'User-Friendly Interface',
      description: 'Intuitive design makes complex financial analysis accessible to both beginners and experienced traders.'
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
                About StockUP
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-200">
                StockUP is a cutting-edge stock market prediction platform that leverages the power of artificial intelligence 
                and neural networks to provide accurate market forecasts. Our advanced algorithms analyze historical data 
                patterns to predict future price movements, helping investors make informed decisions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mx-auto mt-20 max-w-lg sm:mt-24 lg:mt-24 lg:max-w-4xl"
            >
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
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

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mx-auto mt-20 max-w-2xl text-center"
            >
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
                Our Mission
              </h2>
              <p className="text-lg leading-8 text-gray-200">
                We believe that everyone should have access to advanced financial analysis tools. StockUP democratizes 
                AI-powered market prediction, making sophisticated investment analysis available to individual investors 
                and traders worldwide.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
} 