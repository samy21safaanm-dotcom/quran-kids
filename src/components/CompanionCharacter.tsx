import React from 'react';

// شخصية كرتونية (ولد أو بنت) مع تعبير لطيف
const CompanionCharacter: React.FC<{ gender: 'boy' | 'girl'; mood?: 'happy' | 'celebrate' }> = ({ gender, mood = 'happy' }) => {
  const imgSrc = gender === 'boy' ? '/images/cartoon-boy.png' : '/images/cartoon-girl.png';
  return (
    <div className="relative flex flex-col items-center select-none">
      <img
        src={imgSrc}
        alt={gender === 'boy' ? 'ولد' : 'بنت'}
        className={`w-32 h-32 md:w-40 md:h-40 drop-shadow-xl ${mood === 'celebrate' ? 'animate-bounce' : ''}`}
        style={{ filter: mood === 'celebrate' ? 'drop-shadow(0 0 32px gold)' : 'drop-shadow(0 0 8px #ffe066)' }}
      />
      {/* تعبير وجه أو نجوم عند الاحتفال */}
      {mood === 'celebrate' && (
        <img
          src="/images/star.png"
          alt="نجمة احتفالية"
          className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-10 animate-pulse z-20 pointer-events-none"
        />
      )}
    </div>
  );
};

export default CompanionCharacter;
