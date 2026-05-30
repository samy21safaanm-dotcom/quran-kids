'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface Props {
  size?: number;
  glowing?: boolean;
  className?: string;
}

export default function CharacterLujain({ size = 280, glowing = false, className = '' }: Props) {
  return (
    <motion.div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
      animate={glowing ? {
        filter: [
          'drop-shadow(0 0 20px rgba(124,58,237,0.6))',
          'drop-shadow(0 0 50px rgba(236,72,153,0.8))',
          'drop-shadow(0 0 20px rgba(124,58,237,0.6))',
        ],
      } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <Image
        src="/lujain.png"
        alt="لجين"
        width={size}
        height={size}
        className="object-contain w-full h-full"
        priority
      />
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ rotate: -360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: 'center' }}
      >
        <span className="absolute top-2 left-2 text-lg" style={{ filter: 'drop-shadow(0 0 6px #E879F9)' }}>✨</span>
        <span className="absolute bottom-4 right-2 text-sm" style={{ filter: 'drop-shadow(0 0 4px #F0ABFC)' }}>🌸</span>
        <span className="absolute top-1/2 right-0 text-xs" style={{ filter: 'drop-shadow(0 0 4px #C084FC)' }}>✦</span>
      </motion.div>
    </motion.div>
  );
}
