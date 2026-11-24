import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable custom cursor on non-touch screens with mouse pointer
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.getAttribute('role') === 'button'
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none">
      {/* Outer crosshair / target indicator */}
      <motion.div
        className="absolute top-0 left-0 rounded-full flex items-center justify-center"
        animate={{
          x: mousePosition.x - (isHovered ? 24 : 16),
          y: mousePosition.y - (isHovered ? 24 : 16),
          width: isHovered ? 48 : 32,
          height: isHovered ? 48 : 32,
          scale: isClicking ? 0.75 : 1,
          borderColor: isHovered ? '#00F0FF' : '#FF007F',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 350, mass: 0.15 }}
        style={{
          border: '2px solid',
          boxShadow: isHovered
            ? '0 0 16px rgba(0,240,255,0.7), inset 0 0 8px rgba(0,240,255,0.4)'
            : '0 0 12px rgba(255,0,127,0.7)',
        }}
      >
        {/* Reticle tick marks for comic/game feel */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-white" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-white" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-0.5 bg-white" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-0.5 bg-white" />
      </motion.div>

      {/* Inner glowing dot */}
      <motion.div
        className="absolute top-0 left-0 w-2 h-2 rounded-full bg-vice-yellow"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isClicking ? 1.5 : 1,
        }}
        transition={{ type: 'spring', damping: 35, stiffness: 600, mass: 0.05 }}
        style={{
          boxShadow: '0 0 8px #FFDE59',
        }}
      />
    </div>
  );
};
