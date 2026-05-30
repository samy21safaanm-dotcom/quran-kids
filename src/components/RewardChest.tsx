import React from 'react';

// صندوق كنز مكافآت متحرك مع تأثير احتفالي
const RewardChest: React.FC<{ open?: boolean; onClick?: () => void }> = ({ open = false, onClick }) => {
  return (
    <div className="relative flex flex-col items-center group cursor-pointer select-none" onClick={onClick}>
      {/* ظل ثلاثي الأبعاد */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-black/20 rounded-full blur-xl z-0" />
      {/* صورة الصندوق */}
      <img
        src="/images/chest.png"
        alt="صندوق الكنز"
        className={`w-36 h-28 z-10 transition-transform duration-500 ${open ? 'animate-bounce scale-110' : 'group-hover:scale-105'}`}
        style={{ filter: open ? 'drop-shadow(0 0 32px gold)' : 'drop-shadow(0 0 12px #ffe066)' }}
      />
      {/* نجوم متحركة عند الفتح */}
      {open && (
        <img
          src="/images/star.png"
          alt="نجمة احتفالية"
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-24 h-16 animate-pulse z-20 pointer-events-none"
        />
      )}
    </div>
  );
};

export default RewardChest;
