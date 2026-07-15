import React, { useState } from 'react';
import ChallengeLayout from './ChallengeLayout';
import OrderAyatChallenge from './OrderAyatChallenge';
import AutoRateChallenge from './AutoRateChallenge';
import FlyingWordsGame from './FlyingWordsGame';
import type { ChallengeType, ChallengeData, ChildProfile, CompleteAyahChallengeData } from './types';
import { playSuccessSound } from '../lib/feedbackAudio';

// اجعل الشخصية ديناميكية حسب الجنس
const mockChild: ChildProfile = {
  name: 'صالح',
  age: 8,
  gender: 'boy', // 'boy' لنور، 'girl' للُجين
  level: 2,
  stars: 5,
  completedSurahs: 12,
};

// Props interface
interface ChallengeScreenProps {
  ayat?: string[];
  surahName?: string;
  surahId?: number;
}

const defaultAyat = [
  'قُلْ هُوَ اللَّهُ أَحَدٌ',
  'اللَّهُ الصَّمَدُ',
  'لَمْ يَلِدْ وَلَمْ يُولَدْ',
  'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
];

import { FaGamepad } from 'react-icons/fa';
import { getFaIcon } from '../components/FaIconWrapper';
import CinematicBackground from '../components/CinematicBackground';
import CinematicTitle from '../components/CinematicTitle';
import ChallengeCard from '../components/ChallengeCard';
import RewardChest from '../components/RewardChest';
import CompanionCharacter from '../components/CompanionCharacter';
import AnimatedStars from '../components/AnimatedStars';

function MissingWordGame({ ayat }: { ayat: string[] }) {
  // لعبة الكلمة الناقصة: تظهر آية ناقصة كلمة، وعلى الطفل اختيار الكلمة الصحيحة
  const [current, setCurrent] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const ayah = ayat[current];
  // اختر كلمة عشوائية من الآية
  const words = ayah.split(' ');
  const missingIdx = Math.max(1, Math.floor(Math.random() * (words.length - 1)));
  const correctWord = words[missingIdx];
  const options = [correctWord];
  while (options.length < 3) {
    const w = ayat.join(' ').split(' ')[Math.floor(Math.random() * ayat.join(' ').split(' ').length)];
    if (!options.includes(w) && w.length > 1) options.push(w);
  }
  options.sort(() => Math.random() - 0.5);
  const ayahWithBlank = words.map((w, i) => i === missingIdx ? '____' : w).join(' ');
  return (
    <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8 w-full h-full px-2 sm:px-0">
      <div className="text-lg sm:text-xl md:text-2xl font-bold text-purple-900 mb-2 sm:mb-4 text-center">اختر الكلمة الناقصة:</div>
      <div className="bg-white/80 rounded-xl p-4 sm:p-5 md:p-6 text-base sm:text-lg md:text-xl font-black text-purple-800 shadow mb-2 sm:mb-4 w-full max-w-[min(100%,28rem)] text-center">{ayahWithBlank}</div>
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 w-full">
        {options.map(opt => (
          <button key={opt} className={`w-full sm:w-auto px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-full text-base sm:text-lg font-bold shadow transition min-h-11 ${showResult ? (opt === correctWord ? 'bg-green-400 text-white' : 'bg-gray-200') : 'bg-yellow-200 hover:bg-yellow-300 text-purple-900'}`}
            disabled={showResult}
            onClick={() => { setShowResult(true); setIsCorrect(opt === correctWord); }}>
            {opt}
          </button>
        ))}
      </div>
      {showResult && (
        <div className={`mt-3 sm:mt-4 text-base sm:text-lg md:text-xl font-bold text-center ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>{isCorrect ? 'أحسنت! إجابة صحيحة' : 'إجابة غير صحيحة'}</div>
      )}
      {showResult && (
        <button className="mt-4 sm:mt-6 px-5 sm:px-7 md:px-8 py-2.5 rounded-full bg-purple-600 text-white font-bold text-base sm:text-lg shadow min-h-11" onClick={() => { setShowResult(false); setIsCorrect(null); setCurrent((c) => (c + 1) % ayat.length); }}>التالي</button>
      )}
    </div>
  );
}

export default function ChallengeScreen({
  ayat = defaultAyat,
  surahName = 'سورة الإخلاص',
  surahId = 112
}: ChallengeScreenProps = {}) {
  const challengeAyat = ayat && Array.isArray(ayat) && ayat.length > 0 ? ayat : defaultAyat;

  // Debug logging
  console.log('🔍 ChallengeScreen Props:', { surahId, surahName, ayatLength: ayat?.length });

  const [orderSuccess, setOrderSuccess] = useState(false);
  const [completeSuccess, setCompleteSuccess] = useState(false);
  const [stars, setStars] = useState(0);
  const [screen, setScreen] = useState(0); // 0: ترتيب، 1: تقييم الحفظ، 2: إلعب
  // عند النجاح في الترتيب
  const handleOrderSuccess = () => {
    setOrderSuccess(true);
    setStars((s) => Math.max(s, 1));
    playSuccessSound();
    setTimeout(() => setOrderSuccess(false), 2000);
  };
  // عند النجاح في الإكمال
  const handleCompleteSuccess = () => {
    setCompleteSuccess(true);
    setStars((s) => Math.max(s, 2));
    playSuccessSound();
    setTimeout(() => setCompleteSuccess(false), 2000);
  };
  // وظائف الأزرار السفلية
  const handleNext = () => {
    window.alert('تم الانتقال للتحدي التالي (مثال)! يمكنك ربطه بالتحدي التالي فعليًا.');
  };
  const handleRetry = () => {
    window.location.reload();
  };
  const handleBack = () => {
    window.location.href = '/'; // عدّل المسار حسب صفحة السورة أو القائمة الرئيسية
  };
  // رابط السورة الكاملة (مثال: ضع mp3 حقيقي لاحقًا)
  const surahAudioUrl = '/audios/ikhlas-full.mp3';

  // suppress unused warnings in this demo screen
  void ChallengeLayout;
  void ChallengeCard;
  void CinematicTitle;
  void MissingWordGame;
  void handleNext;
  void handleRetry;
  void handleBack;
  void surahAudioUrl;
  void completeSuccess;

  // شاشة التحديات
  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        backgroundImage: 'url(/images/challenge-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <CinematicBackground />
      <AnimatedStars />
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-40">
        <button
          type="button"
          onClick={() => {
            window.location.href = '/';
          }}
          className="px-4 sm:px-5 py-2 rounded-full font-extrabold text-sm sm:text-base shadow-lg border-2 border-yellow-300 bg-white/90 text-purple-900 hover:bg-yellow-100 transition min-h-11"
        >
          🏠 الرئيسية
        </button>
      </div>

      {/* أزرار التنقل بين الشاشات */}
      <div className="w-full flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-6 pt-8 sm:pt-10 pb-3 sm:pb-4 z-30 px-2">
        <button
          className={`px-4 sm:px-6 md:px-10 py-2.5 sm:py-3 md:py-4 rounded-full font-extrabold text-sm sm:text-lg md:text-2xl shadow-lg transition border-2 sm:border-4 border-yellow-400 min-h-11 ${screen === 0 ? 'bg-yellow-400 text-purple-900' : 'bg-white/80 text-purple-700 hover:bg-yellow-100/80'}`}
          style={{ background: screen === 0 ? 'rgba(245,200,66,0.97)' : 'rgba(255,255,255,0.8)', color: screen === 0 ? '#4C1D95' : '#7C3AED' }}
          onClick={() => setScreen(0)}
        >
          ترتيب الآيات
        </button>
        <button
          className={`px-4 sm:px-6 md:px-10 py-2.5 sm:py-3 md:py-4 rounded-full font-extrabold text-sm sm:text-lg md:text-2xl shadow-lg transition border-2 sm:border-4 border-yellow-400 min-h-11 ${screen === 1 ? 'bg-yellow-400 text-purple-900' : 'bg-white/80 text-purple-700 hover:bg-yellow-100/80'}`}
          style={{ background: screen === 1 ? 'rgba(245,200,66,0.97)' : 'rgba(255,255,255,0.8)', color: screen === 1 ? '#4C1D95' : '#7C3AED' }}
          onClick={() => setScreen(1)}
        >
          تقييم الحفظ
        </button>
        <button
          className={`px-4 sm:px-6 md:px-10 py-2.5 sm:py-3 md:py-4 rounded-full font-extrabold text-sm sm:text-lg md:text-2xl shadow-lg transition border-2 sm:border-4 border-yellow-400 min-h-11 ${screen === 2 ? 'bg-yellow-400 text-purple-900' : 'bg-white/80 text-purple-700 hover:bg-yellow-100/80'}`}
          style={{ background: screen === 2 ? 'rgba(245,200,66,0.97)' : 'rgba(255,255,255,0.8)', color: screen === 2 ? '#4C1D95' : '#7C3AED' }}
          onClick={() => setScreen(2)}
        >
          إلعب {getFaIcon('FaGamepad', 'inline ml-2')}
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-end w-full px-2 sm:px-3 md:px-8 pb-20 sm:pb-24 md:pb-32 bg-gradient-to-br from-purple-400/30 via-yellow-100/60 to-yellow-200/40 relative">
        {screen === 0 && (
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 relative mb-20 sm:mb-28 md:mb-40">
            {/* شخصية كرتونية يمين الصندوق */}
            <div className="hidden md:block">
              <CompanionCharacter gender={mockChild.gender} mood={orderSuccess ? 'celebrate' : 'happy'} />
            </div>
            {/* صندوق التحدي */}
            <div className="flex flex-col items-center w-full max-w-3xl mx-auto">
              <div className="bg-white/95 rounded-3xl shadow-2xl p-4 sm:p-6 md:p-10 mb-4 flex flex-col items-center relative border-2 sm:border-4 border-yellow-200/60" style={{ boxShadow: '0 8px 48px 8px #ffe06655, 0 0 0 8px #fffbe6cc' }}>
                {/* زخارف ذهبية */}
                <div className="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2 z-20 scale-90 sm:scale-100 origin-center">
                  <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="60" cy="20" rx="58" ry="16" fill="#fffbe6" fillOpacity="0.7" />
                    <ellipse cx="60" cy="20" rx="48" ry="10" fill="#ffe066" fillOpacity="0.5" />
                  </svg>
                </div>
                {/* نجوم حول الصندوق */}
                {getFaIcon('FaStar', 'absolute -top-6 -right-6 text-yellow-400 text-3xl animate-spin-slow')}
                {getFaIcon('FaStar', 'absolute -top-6 -left-6 text-yellow-300 text-xl')}
                {getFaIcon('FaStar', 'absolute bottom-2 left-2 text-yellow-200 text-lg')}
                <OrderAyatChallenge ayat={challengeAyat} onSuccess={handleOrderSuccess} />
                {/* صندوق مكافآت عند النجاح */}
                {orderSuccess && (
                  <div className="absolute left-1/2 -translate-x-1/2 -bottom-24 sm:-bottom-28 md:-bottom-32 z-30 animate-fade-in scale-90 sm:scale-100 origin-center">
                    <RewardChest open={true} />
                  </div>
                )}
              </div>
              {orderSuccess && (
                <div className="flex flex-col items-center mt-6">
                  <audio src="/audios/clap.mp3" autoPlay style={{ display: 'none' }} />
                  <div className="text-green-700 font-extrabold text-lg sm:text-xl text-center animate-bounce">أحسنت! ⭐ تم اجتياز التحدي الأول</div>
                </div>
              )}
            </div>
            {/* شخصية كرتونية يسار الصندوق (للبنات فقط) */}
            <div className="hidden md:block">
              <CompanionCharacter gender={mockChild.gender === 'girl' ? 'girl' : 'boy'} mood={orderSuccess ? 'celebrate' : 'happy'} />
            </div>
          </div>
        )}

        {screen === 1 && (
          <div className="w-full flex flex-col items-center justify-center">
            <div className="mb-6 flex flex-col items-center">
              <div className="rounded-full bg-purple-200 shadow-lg flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-2 border-4 border-white text-3xl sm:text-4xl">🎤</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-black text-purple-900 drop-shadow mb-1 text-center">سجل وقيّم نفسك</div>
              <div className="text-sm sm:text-base text-purple-700 font-bold text-center px-2">اقرأ كل آية بصوت واضح ثم قيّم تلاوتك</div>
            </div>
            <div className="w-full max-w-2xl mx-auto">
              <div className="bg-white/95 rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 mb-4 flex flex-col items-center relative border-2 border-yellow-200">
                <AutoRateChallenge
                  ayat={challengeAyat}
                  onSuccess={handleCompleteSuccess}
                />
              </div>
            </div>
          </div>
        )}

        {screen === 2 && (
          <div className="w-full flex flex-col items-center justify-center">
            <div className="mb-6 flex flex-col items-center">
              <div className="rounded-full bg-yellow-200 shadow-lg flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-2 border-4 border-white text-3xl sm:text-4xl">🎮</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-black text-purple-900 drop-shadow mb-1 text-center">اصطد الكلمة!</div>
              <div className="text-sm sm:text-base text-purple-700 font-bold text-center px-2">اضغط على الكلمة الطائرة الصحيحة لتكمل الآية</div>
            </div>
            <div className="w-full max-w-2xl mx-auto">
              <div className="rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 mb-4 flex flex-col items-center relative border-2 border-purple-400/40"
                style={{ background: 'rgba(49,10,130,0.75)' }}>
                <FlyingWordsGame
                  ayat={challengeAyat}
                  onSuccess={() => { setStars(s => Math.max(s, 3)); playSuccessSound(); }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
