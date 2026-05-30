import React from 'react';

interface VerseCardProps {
  ayah: string;
  index?: number;
  isSelected?: boolean;
  isCorrect?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

// بطاقة آية تفاعلية مع تأثير زجاجي ولمسات ذهبية
const VerseCard: React.FC<VerseCardProps> = ({ ayah, index, isSelected, isCorrect, onClick, disabled }) => {
  return (
    <button
      className={`relative w-full min-w-[180px] max-w-xs px-6 py-5 mb-2 rounded-2xl font-bold text-xl md:text-2xl text-purple-900 shadow-lg border-2 transition-all duration-200
        ${isSelected ? 'bg-yellow-100/90 border-yellow-400 scale-105' : 'bg-white/70 border-white/60 hover:bg-yellow-50'}
        ${isCorrect === true ? 'ring-4 ring-green-400' : ''}
        ${isCorrect === false ? 'ring-4 ring-red-400' : ''}
        ${disabled ? 'opacity-60 pointer-events-none' : ''}
      `}
      onClick={onClick}
      disabled={disabled}
      style={{fontFamily:'Tajawal, Arial'}}
    >
      {/* زخرفة ذهبية جانبية */}
      <span className="absolute left-2 top-2 text-yellow-400 text-lg select-none">{index !== undefined ? index + 1 : ''}</span>
      <span className="drop-shadow text-shadow-gold select-none">{ayah}</span>
      {/* تأثير زجاجي */}
      <span className="absolute inset-0 rounded-2xl border-2 border-yellow-200/40 pointer-events-none" style={{boxShadow:'0 0 24px 2px #fffbe6cc'}} />
    </button>
  );
};

export default VerseCard;
