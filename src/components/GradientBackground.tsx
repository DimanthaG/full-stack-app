'use client';

import { motion } from 'framer-motion';

export default function GradientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden flex items-center justify-center w-screen h-screen">
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'radial-gradient(circle at center, #2A3B4C 0%, #4A5B6C 25%, #6A7B8C 50%, #8A9B9C 100%)',
        }}
      />
      <motion.div
        initial={{ scale: 1 }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle at center, rgba(0,0,0,0.7) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
    </div>
  );
} 