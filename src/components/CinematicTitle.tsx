import React from 'react';

export default function CinematicTitle() {
  return (
    <div className="relative flex flex-col items-center justify-center mt-8 mb-6 select-none">
      {/* Banner */}
      <div className="relative z-10">
        <div className="px-10 py-4 rounded-full bg-gradient-to-r from-yellow-400 via-purple-500 to-yellow-300 shadow-2xl border-4 border-yellow-100 flex flex-col items-center animate-glow">
          <span className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg tracking-wide" style={{fontFamily:'Tajawal, Arial'}}>اتحدى وإلعب</span>
          <span className="text-lg md:text-xl font-bold text-yellow-100 mt-2 drop-shadow">تعلم القرآن وتحدى نفسك!</span>
        </div>
        {/* Stars */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-2">
          <span className="text-yellow-300 text-3xl animate-bounce">★</span>
          <span className="text-yellow-200 text-2xl animate-pulse">★</span>
          <span className="text-yellow-400 text-4xl animate-spin-slow">★</span>
        </div>
      </div>
      {/* Decorative Ornaments */}
      {/* تم حذف صورة الديكور غير المتوفرة */}
    </div>
  );
}
