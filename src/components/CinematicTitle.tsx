import React from 'react';

export default function CinematicTitle() {
  return (
    <div className="relative flex flex-col items-center justify-center mt-5 sm:mt-7 md:mt-8 mb-4 sm:mb-5 md:mb-6 select-none px-2">
      {/* Banner */}
      <div className="relative z-10">
        <div className="px-5 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 rounded-full bg-gradient-to-r from-yellow-400 via-purple-500 to-yellow-300 shadow-2xl border-2 sm:border-4 border-yellow-100 flex flex-col items-center animate-glow max-w-[min(100%,44rem)]">
          <span className="text-2xl sm:text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg tracking-wide text-center" style={{fontFamily:'Tajawal, Arial'}}>اتحدى وإلعب</span>
          <span className="text-sm sm:text-base md:text-xl font-bold text-yellow-100 mt-1 sm:mt-2 drop-shadow text-center">تعلم القرآن وتحدى نفسك!</span>
        </div>
        {/* Stars */}
        <div className="absolute -top-4 sm:-top-5 md:-top-6 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
          <span className="text-yellow-300 text-xl sm:text-2xl md:text-3xl animate-bounce">★</span>
          <span className="text-yellow-200 text-lg sm:text-xl md:text-2xl animate-pulse">★</span>
          <span className="text-yellow-400 text-2xl sm:text-3xl md:text-4xl animate-spin-slow">★</span>
        </div>
      </div>
      {/* Decorative Ornaments */}
      {/* تم حذف صورة الديكور غير المتوفرة */}
    </div>
  );
}
