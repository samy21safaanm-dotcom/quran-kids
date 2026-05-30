

"use client";
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { JUZ_AMMA, AL_IKHLAS_AYAT, AL_FALAQ_AYAT, AL_FIL_AYAT } from '@/lib/juzAmmaData';
import OrderAyatChallenge from '@/challenge/OrderAyatChallenge';
import CompleteAyahChallenge from '@/challenge/CompleteAyahChallenge';
import CompanionCharacter from '@/components/CompanionCharacter';
import RewardChest from '@/components/RewardChest';
import AnimatedStars from '@/components/AnimatedStars';
import CinematicBackground from '@/components/CinematicBackground';
import { playSuccessSound } from '@/lib/feedbackAudio';

export default function SurahChallengePage() {
  const params = useParams();
  const surahIdNum = Number(params.surahId);
  return <SurahChallengeClient surahIdNum={surahIdNum} />;
}

function SurahChallengeClient({ surahIdNum }: { surahIdNum: number }) {
  // فقط السور التي لها قصة سينمائية
  const allowedChallengeIds = [112, 113, 105];
  if (!allowedChallengeIds.includes(surahIdNum)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-red-600 font-bold mt-20">لا يوجد تحدي لهذه السورة حالياً</div>
      </div>
    );
  }
  const surah = JUZ_AMMA.find(s => s.id === surahIdNum);
  let ayat: string[] = [];
  if (surahIdNum === 112) {
    ayat = AL_IKHLAS_AYAT.map(a => a.arabic);
  } else if (surahIdNum === 113) {
    ayat = AL_FALAQ_AYAT.map(a => a.arabic);
  } else if (surahIdNum === 105) {
    ayat = AL_FIL_AYAT.map(a => a.arabic);
  } else if (surah && Array.isArray(surah.ayat)) {
    ayat = surah.ayat.map((a: any) => a.arabic);
  }
  const child = {
    name: 'نور',
    age: 8,
    gender: 'boy',
    level: 2,
    stars: 5,
    completedSurahs: 12,
  };
  const [screen, setScreen] = useState(0); // 0: ترتيب، 1: تقييم الحفظ، 2: إلعب
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [completeSuccess, setCompleteSuccess] = useState(false);
  const [stars, setStars] = useState(0);

  const handleOrderSuccess = () => {
    setOrderSuccess(true);
    setStars((s) => Math.max(s, 1));
    playSuccessSound();
    setTimeout(() => setOrderSuccess(false), 2000);
  };
  const handleCompleteSuccess = () => {
    setCompleteSuccess(true);
    setStars((s) => Math.max(s, 2));
    playSuccessSound();
    setTimeout(() => setCompleteSuccess(false), 2000);
  };

  if (!ayat.length) {
    return <div className="text-center text-red-600 mt-10">السورة غير موجودة أو لا توجد بيانات آيات.</div>;
  }

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
          إلعب
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-end w-full px-2 md:px-8 pb-32 bg-gradient-to-br from-purple-400/30 via-yellow-100/60 to-yellow-200/40 relative">
        {screen === 0 && (
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8 relative mb-40">
            <div className="hidden md:block">
              <CompanionCharacter gender={child.gender === 'girl' ? 'girl' : 'boy'} mood={orderSuccess ? 'celebrate' : 'happy'} />
            </div>
            <div className="flex flex-col items-center w-full max-w-3xl mx-auto">
              <div className="bg-white/95 rounded-3xl shadow-2xl p-10 mb-4 flex flex-col items-center relative border-4 border-yellow-200/60" style={{boxShadow:'0 8px 48px 8px #ffe06655, 0 0 0 8px #fffbe6cc'}}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20">
                  <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="60" cy="20" rx="58" ry="16" fill="#fffbe6" fillOpacity="0.7" />
                    <ellipse cx="60" cy="20" rx="48" ry="10" fill="#ffe066" fillOpacity="0.5" />
                  </svg>
                </div>
                <span className="absolute -top-6 -right-6 text-yellow-400 text-3xl animate-spin-slow">⭐</span>
                <span className="absolute -top-6 -left-6 text-xl text-yellow-300">⭐</span>
                <span className="absolute bottom-2 left-2 text-lg text-yellow-200">⭐</span>
                <OrderAyatChallenge ayat={ayat} onSuccess={handleOrderSuccess} />
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
            <div className="hidden md:block">
              <CompanionCharacter gender={child.gender === 'girl' ? 'girl' : 'boy'} mood={orderSuccess ? 'celebrate' : 'happy'} />
            </div>
          </div>
        )}
        {screen === 1 && (
          <div className="w-full flex flex-col items-center justify-center">
            <div className="mb-8 flex flex-col items-center">
              <div className="rounded-full bg-purple-200 shadow-lg flex items-center justify-center w-28 h-28 mb-2 border-4 border-white">🎤</div>
              <div className="text-4xl font-black text-purple-900 drop-shadow mb-2">تقييم الحفظ</div>
              <div className="mb-4 text-lg text-purple-700 font-bold">سجل تلاوتك للآية المطلوبة أو استمع للسورة كاملة</div>
            </div>
            <div className="mb-4 flex flex-col items-center">
              <button
                className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold px-6 py-2 rounded-full shadow mb-2"
                onClick={() => {
                  const audio = new Audio(`/audios/ikhlas-full.mp3`);
                  audio.play();
                }}
              >
                ▶️ استمع للسورة كاملة
              </button>
              <audio src={`/audios/ikhlas-full.mp3`} controls className="w-full max-w-xs" style={{display:'none'}} />
            </div>
            <div className="w-full max-w-3xl mx-auto">
              <div className="bg-white/95 rounded-3xl shadow-2xl p-10 mb-4 flex flex-col items-center relative">
                <span className="absolute -top-6 -right-6 text-yellow-400 text-3xl animate-spin-slow">⭐</span>
                <span className="absolute -top-6 -left-6 text-yellow-300 text-xl">⭐</span>
                <span className="absolute bottom-2 left-2 text-yellow-200 text-lg">⭐</span>
                <CompleteAyahChallenge
                  ayahStart={ayat[0]?.split(' ').slice(0,2).join(' ') || ''}
                  ayahRest={ayat[0]?.split(' ').slice(2).join(' ') || ''}
                  audioUrl={undefined}
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
        {screen === 2 && (
          <div className="w-full flex flex-col items-center justify-center">
            <div className="mb-8 flex flex-col items-center">
              <div className="rounded-full bg-yellow-200 shadow-lg flex items-center justify-center w-28 h-28 mb-2 border-4 border-white">🎮</div>
              <div className="text-4xl font-black text-purple-900 drop-shadow mb-2">إلعب واحفظ السورة</div>
              <div className="mb-4 text-lg text-purple-700 font-bold">اختر الكلمة الناقصة في كل آية لتتقن الحفظ بطريقة ممتعة!</div>
            </div>
            <div className="w-full max-w-3xl mx-auto">
              <div className="bg-white/95 rounded-3xl shadow-2xl p-10 mb-4 flex flex-col items-center relative">
                <span className="absolute -top-6 -right-6 text-yellow-400 text-3xl animate-spin-slow">⭐</span>
                <span className="absolute -top-6 -left-6 text-yellow-300 text-xl">⭐</span>
                <span className="absolute bottom-2 left-2 text-yellow-200 text-lg">⭐</span>
                {/* لعبة الكلمة الناقصة */}
                {/* يمكنك استبدال هذا بمكون منفصل لاحقاً */}
                <div className="text-xl font-bold text-purple-900 mb-4">(مثال) اختر الكلمة الناقصة:</div>
                {/* ... منطق اللعبة ... */}
                <div className="text-gray-500">(لعبة الكلمة الناقصة لم تُنفذ بعد هنا)</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
