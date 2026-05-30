import React from 'react';

// مؤثرات نجوم سحرية متحركة حول الشاشة
const AnimatedStars: React.FC = () => (
  <div className="pointer-events-none select-none z-40">
    <img
      src="/images/star.png"
      alt="نجمة"
      className="fixed top-10 left-10 w-16 h-10 animate-spin-slow opacity-80"
      style={{ filter: 'drop-shadow(0 0 16px gold)' }}
    />
    <img
      src="/images/star.png"
      alt="نجمة"
      className="fixed bottom-16 right-16 w-20 h-12 animate-pulse opacity-70"
      style={{ filter: 'drop-shadow(0 0 24px #ffe066)' }}
    />
    <img
      src="/images/star.png"
      alt="نجمة"
      className="fixed top-1/2 left-1/4 w-12 h-8 animate-bounce opacity-60"
      style={{ filter: 'drop-shadow(0 0 12px #fffbe6)' }}
    />
  </div>
);

export default AnimatedStars;
