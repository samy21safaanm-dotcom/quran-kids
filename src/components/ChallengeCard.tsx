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
    <div className="relative max-w-2xl mx-auto bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl border-4 border-white/40 p-8 pt-14 pb-10 flex flex-col items-center justify-center overflow-visible animate-fade-in">
      {/* زخرفة ذهبية علوية */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20">
        <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="60" cy="20" rx="58" ry="16" fill="#fffbe6" fillOpacity="0.7" />
          <ellipse cx="60" cy="20" rx="48" ry="10" fill="#ffe066" fillOpacity="0.5" />
        </svg>
      </div>
      {/* عنوان التحدي */}
      <div className="text-3xl md:text-4xl font-extrabold text-yellow-700 drop-shadow-lg mb-6 tracking-wide text-center select-none">
        {title}
      </div>
      {/* محتوى التحدي */}
      <div className="w-full flex flex-col items-center gap-6">
        {children}
      </div>
      {/* نجوم الإنجاز */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-3xl drop-shadow ${i < stars ? 'text-yellow-400' : 'text-gray-300/60'}`}>⭐</span>
        ))}
      </div>
      {/* مكافأة متحركة (اختياري) */}
      {reward && (
        <div className="absolute right-6 top-6 animate-bounce z-30">
          {reward}
        </div>
      )}
      {/* تأثير زجاجي إضافي */}
      <div className="absolute inset-0 rounded-3xl border-2 border-white/30 pointer-events-none" style={{boxShadow:'0 0 60px 10px #fffbe6cc, 0 8px 32px #ffe06655'}} />
    </div>
  );
};

export default ChallengeCard;
