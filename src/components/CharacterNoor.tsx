'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface Props {
  size?: number;
  glowing?: boolean;
  className?: string;
}

export default function CharacterNoor({ size = 280, glowing = false, className = '' }: Props) {
  return (
    <motion.div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
      animate={glowing ? {
        filter: [
          'drop-shadow(0 0 20px rgba(14,165,233,0.6))',
          'drop-shadow(0 0 50px rgba(245,200,66,0.8))',
          'drop-shadow(0 0 20px rgba(14,165,233,0.6))',
        ],
      } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <Image
        src="/noor.png"
        alt="نور"
        width={size}
        height={size}
        className="object-contain w-full h-full"
        priority
      />
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: 'center' }}
      >
        <span className="absolute top-2 right-2 text-lg" style={{ filter: 'drop-shadow(0 0 6px #F5C842)' }}>✨</span>
        <span className="absolute bottom-4 left-2 text-sm" style={{ filter: 'drop-shadow(0 0 4px #0EA5E9)' }}>⭐</span>
        <span className="absolute top-1/2 left-0 text-xs" style={{ filter: 'drop-shadow(0 0 4px #F5C842)' }}>✦</span>
      </motion.div>
    </motion.div>
  );
}
