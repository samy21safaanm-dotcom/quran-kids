import React from 'react';

export default function CinematicBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* خلفية صورة التحدي فقط */}
      <img src="/images/challenge-bg.png" alt="خلفية التحدي" className="absolute inset-0 w-full h-full object-cover" style={{zIndex:0}} />
    </div>
  );
}
