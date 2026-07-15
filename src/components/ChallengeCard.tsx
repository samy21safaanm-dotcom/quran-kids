import React from 'react';
import { FaStar } from 'react-icons/fa';

interface ChallengeCardProps {
  title: string;
  children: React.ReactNode;
  stars?: number;
  reward?: React.ReactNode;
}

// صندوق تحدي زجاجي مع تأثيرات سينمائية ونجوم ومكافآت
const ChallengeCard: React.FC<ChallengeCardProps> = ({ title, children, stars = 0, reward }) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl border-2 sm:border-4 border-white/40 p-4 sm:p-6 md:p-8 pt-10 sm:pt-12 md:pt-14 pb-7 sm:pb-8 md:pb-10 flex flex-col items-center justify-center overflow-visible animate-fade-in">
      {/* زخرفة ذهبية علوية */}
      <div className="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2 z-20 scale-90 sm:scale-100 origin-center">
        <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="60" cy="20" rx="58" ry="16" fill="#fffbe6" fillOpacity="0.7" />
          <ellipse cx="60" cy="20" rx="48" ry="10" fill="#ffe066" fillOpacity="0.5" />
        </svg>
      </div>
      {/* عنوان التحدي */}
      <div className="text-xl sm:text-2xl md:text-4xl font-extrabold text-yellow-700 drop-shadow-lg mb-4 sm:mb-5 md:mb-6 tracking-wide text-center select-none">
        {title}
      </div>
      {/* محتوى التحدي */}
      <div className="w-full flex flex-col items-center gap-4 sm:gap-5 md:gap-6">
        {children}
      </div>
      {/* نجوم الإنجاز */}
      <div className="absolute -bottom-6 sm:-bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-20">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-2xl sm:text-3xl drop-shadow ${i < stars ? 'text-yellow-400' : 'text-gray-300/60'}`}>⭐</span>
        ))}
      </div>
      {/* مكافأة متحركة (اختياري) */}
      {reward && (
        <div className="absolute right-3 sm:right-4 md:right-6 top-3 sm:top-4 md:top-6 animate-bounce z-30 scale-90 sm:scale-100 origin-top-right">
          {reward}
        </div>
      )}
      {/* تأثير زجاجي إضافي */}
      <div className="absolute inset-0 rounded-3xl border-2 border-white/30 pointer-events-none" style={{boxShadow:'0 0 60px 10px #fffbe6cc, 0 8px 32px #ffe06655'}} />
    </div>
  );
};

export default ChallengeCard;
