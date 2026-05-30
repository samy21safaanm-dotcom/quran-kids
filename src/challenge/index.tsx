import React, { useState } from 'react';
import ChallengeLayout from './ChallengeLayout';
import OrderAyatChallenge from './OrderAyatChallenge';
import CompleteAyahChallenge from './CompleteAyahChallenge';
import TaqeemHifzChallenge from './CompleteAyahChallenge';
import type { ChallengeType, ChallengeData, ChildProfile, CompleteAyahChallengeData } from './types';
import { playSuccessSound } from '../lib/feedbackAudio';

// اجعل الشخصية ديناميكية حسب الجنس
const mockChild: ChildProfile = {
  name: 'نور',
  age: 8,
  gender: 'boy', // 'boy' لنور، 'girl' للُجين
  level: 2,
  stars: 5,
  completedSurahs: 12,
};

const mockChallenge: ChallengeData = {
  ayat: [
    'قُلْ هُوَ اللَّهُ أَحَدٌ',
    'اللَّهُ الصَّمَدُ',
    'لَمْ يَلِدْ وَلَمْ يُولَدْ',
    'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
  ],
};

const mockCompleteAyah: CompleteAyahChallengeData = {
  ayahStart: 'قُلْ هُوَ اللَّهُ',
  ayahRest: 'أَحَدٌ',
  audioUrl: '/audios/ikhlas-ayah1.mp3', // أضف مسار الصوت إذا توفر
};

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
  const [isCorrect, setIsCorrect] = useState<boolean|null>(null);
  const ayah = ayat[current];
  // اختر كلمة عشوائية من الآية
  const words = ayah.split(' ');
  const missingIdx = Math.max(1, Math.floor(Math.random() * (words.length-1)));
  const correctWord = words[missingIdx];
  const options = [correctWord];
  while (options.length < 3) {
    const w = ayat.join(' ').split(' ')[Math.floor(Math.random()*ayat.join(' ').split(' ').length)];
    if (!options.includes(w) && w.length > 1) options.push(w);
  }
  options.sort(() => Math.random()-0.5);
  const ayahWithBlank = words.map((w,i)=>i===missingIdx?'____':w).join(' ');
  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full h-full">
      <div className="text-2xl font-bold text-purple-900 mb-4">اختر الكلمة الناقصة:</div>
      <div className="bg-white/80 rounded-xl p-6 text-xl font-black text-purple-800 shadow mb-4 min-w-[300px]">{ayahWithBlank}</div>
      <div className="flex gap-6">
        {options.map(opt => (
          <button key={opt} className={`px-6 py-3 rounded-full text-lg font-bold shadow transition ${showResult ? (opt===correctWord ? 'bg-green-400 text-white' : 'bg-gray-200') : 'bg-yellow-200 hover:bg-yellow-300 text-purple-900'}`}
            disabled={showResult}
            onClick={()=>{setShowResult(true); setIsCorrect(opt===correctWord);}}>
            {opt}
          </button>
        ))}
      </div>
      {showResult && (
        <div className={`mt-4 text-xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>{isCorrect ? 'أحسنت! إجابة صحيحة' : 'إجابة غير صحيحة'}</div>
      )}
      {showResult && (
        <button className="mt-6 px-8 py-2 rounded-full bg-purple-600 text-white font-bold text-lg shadow" onClick={()=>{setShowResult(false); setIsCorrect(null); setCurrent((c)=> (c+1)%ayat.length);}}>التالي</button>
      )}
    </div>
  );
}

export default function ChallengeScreen() {
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [completeSuccess, setCompleteSuccess] = useState(false);
  const [stars, setStars] = useState(0);
  const [screen, setScreen] = useState(-1); // -1: القصة السينمائية، 0: ترتيب، 1: تقييم الحفظ، 2: إلعب
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

  // شاشة القصة السينمائية وزر ابدأ التحدي
  if (screen === -1) {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        <CinematicBackground />
        <AnimatedStars />
        <CinematicTitle />
        {/* هنا يمكنك إضافة مكون القصة السينمائية أو صورة أو فيديو */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="bg-white/80 rounded-3xl shadow-2xl p-10 mb-8 flex flex-col items-center border-4 border-yellow-200/60 max-w-2xl mx-auto">
            <div className="text-3xl font-bold text-purple-900 mb-4">قصة قصيرة عن سورة الإخلاص</div>
            <div className="text-lg text-purple-800 mb-6 text-center">كان النبي ﷺ يحب سورة الإخلاص كثيرًا، فهي تعلمنا أن الله واحد لا شريك له. اقرأ القصة أو شاهد الفيديو ثم ابدأ التحدي!</div>
            {/* يمكنك وضع فيديو أو صورة هنا */}
          </div>
          <button
            className="px-10 py-4 rounded-full font-extrabold text-2xl shadow-lg transition bg-yellow-400 text-purple-900 border-4 border-yellow-400 hover:bg-yellow-300"
            onClick={() => setScreen(0)}
          >
            ابدأ التحدي
          </button>
        </div>
      </div>
    );
  }

  // شاشة التحديات بعد الضغط على ابدأ التحدي
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
      {/* العنوان الرئيسي */}
      {/* أزرار التنقل بين الشاشات */}
      <div className="w-full flex justify-center gap-6 pt-8 pb-4 z-30">
        <button
          className={`px-10 py-4 rounded-full font-extrabold text-2xl shadow-lg transition border-4 border-yellow-400 ${screen === 0 ? 'bg-yellow-400 text-purple-900' : 'bg-white/80 text-purple-700 hover:bg-yellow-100/80'}`}
          style={{ background: screen === 0 ? 'rgba(245,200,66,0.97)' : 'rgba(255,255,255,0.8)', color: screen === 0 ? '#4C1D95' : '#7C3AED' }}
          onClick={() => setScreen(0)}
        >
          ترتيب الآيات
        </button>
        <button
          className={`px-10 py-4 rounded-full font-extrabold text-2xl shadow-lg transition border-4 border-yellow-400 ${screen === 1 ? 'bg-yellow-400 text-purple-900' : 'bg-white/80 text-purple-700 hover:bg-yellow-100/80'}`}
          style={{ background: screen === 1 ? 'rgba(245,200,66,0.97)' : 'rgba(255,255,255,0.8)', color: screen === 1 ? '#4C1D95' : '#7C3AED' }}
          onClick={() => setScreen(1)}
        >
          تقييم الحفظ
        </button>
        <button
          className={`px-10 py-4 rounded-full font-extrabold text-2xl shadow-lg transition border-4 border-yellow-400 ${screen === 2 ? 'bg-yellow-400 text-purple-900' : 'bg-white/80 text-purple-700 hover:bg-yellow-100/80'}`}
          style={{ background: screen === 2 ? 'rgba(245,200,66,0.97)' : 'rgba(255,255,255,0.8)', color: screen === 2 ? '#4C1D95' : '#7C3AED' }}
          onClick={() => setScreen(2)}
        >
          إلعب {getFaIcon('FaGamepad', 'inline ml-2')}
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-end w-full px-2 md:px-8 pb-32 bg-gradient-to-br from-purple-400/30 via-yellow-100/60 to-yellow-200/40 relative">
        {screen===0 && (
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8 relative mb-40">
            {/* شخصية كرتونية يمين الصندوق */}
            <div className="hidden md:block">
              <CompanionCharacter gender={mockChild.gender} mood={orderSuccess ? 'celebrate' : 'happy'} />
            </div>
            {/* صندوق التحدي */}
            <div className="flex flex-col items-center w-full max-w-3xl mx-auto">
              <div className="bg-white/95 rounded-3xl shadow-2xl p-10 mb-4 flex flex-col items-center relative border-4 border-yellow-200/60" style={{boxShadow:'0 8px 48px 8px #ffe06655, 0 0 0 8px #fffbe6cc'}}>
                {/* زخارف ذهبية */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20">
                  <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="60" cy="20" rx="58" ry="16" fill="#fffbe6" fillOpacity="0.7" />
                    <ellipse cx="60" cy="20" rx="48" ry="10" fill="#ffe066" fillOpacity="0.5" />
                  </svg>
                </div>
                {/* نجوم حول الصندوق */}
                {getFaIcon('FaStar', 'absolute -top-6 -right-6 text-yellow-400 text-3xl animate-spin-slow')}
                {getFaIcon('FaStar', 'absolute -top-6 -left-6 text-yellow-300 text-xl')}
                {getFaIcon('FaStar', 'absolute bottom-2 left-2 text-yellow-200 text-lg')}
                <OrderAyatChallenge ayat={mockChallenge.ayat} onSuccess={handleOrderSuccess} />
                {/* صندوق مكافآت عند النجاح */}
                {orderSuccess && (
                  <div className="absolute left-1/2 -translate-x-1/2 -bottom-32 z-30 animate-fade-in">
                    <RewardChest open={true} />
                  </div>
                )}
              </div>
              {orderSuccess && (
                <div className="flex flex-col items-center mt-6">
                  <audio src="/audios/clap.mp3" autoPlay style={{display:'none'}} />
                  <div className="text-green-700 font-extrabold text-xl text-center animate-bounce">أحسنت! ⭐ تم اجتياز التحدي الأول</div>
                </div>
              )}
            </div>
            {/* شخصية كرتونية يسار الصندوق (للبنات فقط) */}
            <div className="hidden md:block">
              <CompanionCharacter gender={mockChild.gender === 'girl' ? 'girl' : 'boy'} mood={orderSuccess ? 'celebrate' : 'happy'} />
            </div>
          </div>
        )}
        {screen===1 && (
          <div className="w-full flex flex-col items-center justify-center">
            <div className="mb-8 flex flex-col items-center">
              <div className="rounded-full bg-purple-200 shadow-lg flex items-center justify-center w-28 h-28 mb-2 border-4 border-white">{getFaIcon('FaMicrophone', 'text-purple-700 text-5xl')}</div>
              <div className="text-4xl font-black text-purple-900 drop-shadow mb-2">تقييم الحفظ</div>
              <div className="mb-4 text-lg text-purple-700 font-bold">سجل تلاوتك للآية المطلوبة أو استمع للسورة كاملة</div>
            </div>
            <div className="mb-4 flex flex-col items-center">
              <button
                className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold px-6 py-2 rounded-full shadow mb-2"
                onClick={() => {
                  const audio = new Audio(surahAudioUrl);
                  audio.play();
                }}
              >
                ▶️ استمع للسورة كاملة
              </button>
              <audio src={surahAudioUrl} controls className="w-full max-w-xs" style={{display:'none'}} />
            </div>
            <div className="w-full max-w-3xl mx-auto">
              <div className="bg-white/95 rounded-3xl shadow-2xl p-10 mb-4 flex flex-col items-center relative">
                {getFaIcon('FaStar', 'absolute -top-6 -right-6 text-yellow-400 text-3xl animate-spin-slow')}
                {getFaIcon('FaStar', 'absolute -top-6 -left-6 text-yellow-300 text-xl')}
                {getFaIcon('FaStar', 'absolute bottom-2 left-2 text-yellow-200 text-lg')}
                <TaqeemHifzChallenge
                  ayahStart={mockCompleteAyah.ayahStart}
                  ayahRest={mockChallenge.ayat.join(' ')}
                  audioUrl={mockCompleteAyah.audioUrl}
                  onSuccess={handleCompleteSuccess}
                  onFail={() => {}}
                />
              </div>
              {completeSuccess && (
                <div className="flex flex-col items-center mt-6">
                  <audio src="/audios/clap.mp3" autoPlay style={{display:'none'}} />
                  <div className="text-green-700 font-extrabold text-xl text-center animate-bounce">ممتاز! ⭐ حفظك رائع</div>
                </div>
              )}
            </div>
          </div>
        )}
        {screen===2 && (
          <div className="w-full flex flex-col items-center justify-center">
            <div className="mb-8 flex flex-col items-center">
              <div className="rounded-full bg-yellow-200 shadow-lg flex items-center justify-center w-28 h-28 mb-2 border-4 border-white">{getFaIcon('FaSmile', 'text-yellow-600 text-5xl')}</div>
              <div className="text-4xl font-black text-purple-900 drop-shadow mb-2">إلعب واحفظ السورة</div>
              <div className="mb-4 text-lg text-purple-700 font-bold">اختر الكلمة الناقصة في كل آية لتتقن الحفظ بطريقة ممتعة!</div>
            </div>
            <div className="w-full max-w-3xl mx-auto">
              <div className="bg-white/95 rounded-3xl shadow-2xl p-10 mb-4 flex flex-col items-center relative">
                {getFaIcon('FaStar', 'absolute -top-6 -right-6 text-yellow-400 text-3xl animate-spin-slow')}
                {getFaIcon('FaStar', 'absolute -top-6 -left-6 text-yellow-300 text-xl')}
                {getFaIcon('FaStar', 'absolute bottom-2 left-2 text-yellow-200 text-lg')}
                <MissingWordGame ayat={mockChallenge.ayat} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
