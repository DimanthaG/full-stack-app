'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function ShaderBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const colors = [
      { r: 45, g: 74, b: 227 },  // Blue
      { r: 250, g: 55, b: 95 },  // Pink
      { r: 37, g: 99, b: 235 }   // Deep blue
    ];

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX / window.innerWidth;
      mouseY = event.clientY / window.innerHeight;
      updateGradient();
    };

    const updateGradient = () => {
      if (!containerRef.current) return;

      const xPercent = mouseX * 100;
      const yPercent = mouseY * 100;

      containerRef.current.style.background = `
        radial-gradient(
          circle at ${xPercent}% ${yPercent}%,
          rgba(${colors[0].r}, ${colors[0].g}, ${colors[0].b}, 0.15),
          rgba(${colors[1].r}, ${colors[1].g}, ${colors[1].b}, 0.15),
          rgba(${colors[2].r}, ${colors[2].g}, ${colors[2].b}, 0.15)
        )
      `;
    };

    window.addEventListener('mousemove', handleMouseMove);
    updateGradient();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 -z-10 transition-all duration-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    />
  );
} 