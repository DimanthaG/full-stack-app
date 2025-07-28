'use client';

import { motion } from 'framer-motion';
import { FaChartLine, FaBrain, FaShieldAlt, FaDatabase } from 'react-icons/fa';

const features = [
  {
    icon: <FaChartLine className="h-6 w-6" />,
    title: 'Advanced Stock Analysis',
    description: 'Our platform uses cutting-edge neural networks to analyze market trends and patterns, providing accurate predictions for future market movements.'
  },
  {
    icon: <FaBrain className="h-6 w-6" />,
    title: 'Machine Learning',
    description: 'Powered by Brain.js, our prediction model continuously learns from historical data to improve its accuracy and reliability.'
  },
  {
    icon: <FaShieldAlt className="h-6 w-6" />,
    title: 'Secure Platform',
    description: 'Your data is protected with industry-standard security measures, ensuring your investment strategies remain private and secure.'
  },
  {
    icon: <FaDatabase className="h-6 w-6" />,
    title: 'Historical Data',
    description: 'Access comprehensive historical market data to make informed decisions and validate prediction accuracy.'
  }
];

export default function About() {
  return (
    <div className="py-12 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            About StockUP Predictor
          </h2>
          <p className="mt-4 text-lg text-gray-200 max-w-2xl mx-auto">
            StockUP combines advanced neural networks with comprehensive market data
            to provide accurate stock market predictions and insights.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                className="relative bg-[#2A3B4C]/20 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-[#4A5B6C]/30"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#DAA520] text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-base text-gray-200">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-semibold text-white">
            Ready to start predicting?
          </h3>
          <p className="mt-4 text-lg text-gray-200">
            Join thousands of investors who are already using StockUP to make smarter investment decisions.
          </p>
        </motion.div>
      </div>
    </div>
  );
} 