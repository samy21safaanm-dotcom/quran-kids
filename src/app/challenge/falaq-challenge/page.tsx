"use client";
import React, { useState } from 'react';
import { JUZ_AMMA } from '@/lib/juzAmmaData';
import OrderAyatChallenge from '@/challenge/OrderAyatChallenge';
import CompleteAyahChallenge from '@/challenge/CompleteAyahChallenge';
import CompanionCharacter from '@/components/CompanionCharacter';
import RewardChest from '@/components/RewardChest';
import AnimatedStars from '@/components/AnimatedStars';
import CinematicBackground from '@/components/CinematicBackground';
import { playSuccessSound } from '@/lib/feedbackAudio';

export default function FalaqChallengePage() {
  // سورة الفلق رقمها 113
  const surahIdNum = 113;
  const surah = JUZ_AMMA.find(s => s.id === surahIdNum);
  let ayat: string[] = [];
  if (surah && Array.isArray(surah.ayat)) {
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

  if (!surah || !Array.isArray(surah.ayat) || !ayat.length) {
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
          // سورة الفلق رقمها 113
          const surahIdNum = 113;
          const surah = JUZ_AMMA.find(s => s.id === surahIdNum);
          let ayat: string[] = [];
          if (surah && Array.isArray(surah.ayat)) {
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
          const [showCinematic, setShowCinematic] = useState(true);
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

          if (!surah || !Array.isArray(surah.ayat) || !ayat.length) {
            return <div className="text-center text-red-600 mt-10">السورة غير موجودة أو لا توجد بيانات آيات.</div>;
          }

          if (showCinematic) {
            return (
              <div className="min-h-screen flex flex-col relative overflow-hidden" style={{backgroundImage: 'url(/images/challenge-bg.png)',backgroundSize: 'cover',backgroundPosition: 'center',backgroundRepeat: 'no-repeat'}}>
                <CinematicBackground />
                <AnimatedStars />
                <div className="flex-1 flex flex-col items-center justify-center z-20">
                  <div className="bg-white/80 rounded-3xl shadow-2xl p-10 mb-8 flex flex-col items-center border-4 border-yellow-200/60 max-w-2xl mx-auto">
                    <div className="text-3xl font-bold text-purple-900 mb-4">قصة سورة الفلق</div>
                    <div className="text-lg text-purple-800 mb-6 text-center">تجربة سينمائية مشوقة للأطفال حول سورة الفلق.</div>
                    <video controls className="rounded-3xl shadow-2xl mb-4 w-full max-w-2xl">
                      <source src="/videos/al-falaq-story.mp4" type="video/mp4" />
                      متصفحك لا يدعم تشغيل الفيديو.
                    </video>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <button className="px-10 py-4 rounded-full font-extrabold text-2xl shadow-lg transition bg-yellow-400 text-purple-900 border-4 border-yellow-400 hover:bg-yellow-300" onClick={() => setShowCinematic(false)}>
                      ابدأ التحدي
                    </button>
                    <button className="px-10 py-4 rounded-full font-extrabold text-2xl shadow-lg transition bg-white/80 text-purple-900 border-4 border-yellow-400 hover:bg-yellow-100" onClick={() => {const v = document.querySelector('video'); if(v) v.currentTime = 0;}}>
                      إعادة القصة
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div className="min-h-screen flex flex-col relative overflow-hidden" style={{backgroundImage: 'url(/images/challenge-bg.png)',backgroundSize: 'cover',backgroundPosition: 'center',backgroundRepeat: 'no-repeat'}}>
              <CinematicBackground />
              <AnimatedStars />
              <div className="w-full flex justify-center gap-6 pt-8 pb-4 z-30">
                <button className={`px-10 py-4 rounded-full font-extrabold text-2xl shadow-lg transition border-4 border-yellow-400 ${screen === 0 ? 'bg-yellow-400 text-purple-900' : 'bg-white/80 text-purple-700 hover:bg-yellow-100/80'}`} style={{ background: screen === 0 ? 'rgba(245,200,66,0.97)' : 'rgba(255,255,255,0.8)', color: screen === 0 ? '#4C1D95' : '#7C3AED' }} onClick={() => setScreen(0)}>
                  ترتيب الآيات
                </button>
                <button className={`px-10 py-4 rounded-full font-extrabold text-2xl shadow-lg transition border-4 border-yellow-400 ${screen === 1 ? 'bg-yellow-400 text-purple-900' : 'bg-white/80 text-purple-700 hover:bg-yellow-100/80'}`} style={{ background: screen === 1 ? 'rgba(245,200,66,0.97)' : 'rgba(255,255,255,0.8)', color: screen === 1 ? '#4C1D95' : '#7C3AED' }} onClick={() => setScreen(1)}>
                  تقييم الحفظ
                </button>
                <button className={`px-10 py-4 rounded-full font-extrabold text-2xl shadow-lg transition border-4 border-yellow-400 ${screen === 2 ? 'bg-yellow-400 text-purple-900' : 'bg-white/80 text-purple-700 hover:bg-yellow-100/80'}`} style={{ background: screen === 2 ? 'rgba(245,200,66,0.97)' : 'rgba(255,255,255,0.8)', color: screen === 2 ? '#4C1D95' : '#7C3AED' }} onClick={() => setScreen(2)}>
                  إلعب
                </button>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center z-20">
                {screen === 0 && <OrderAyatChallenge ayat={ayat} onSuccess={handleOrderSuccess} />}
                {screen === 1 && <CompleteAyahChallenge ayat={ayat} onSuccess={handleCompleteSuccess} />}
                {screen === 2 && <RewardChest stars={stars} />}
              </div>
            </div>
          );
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
                <div className="text-xl font-bold text-purple-900 mb-4">(مثال) اختر الكلمة الناقصة:</div>
                <div className="text-gray-500">(لعبة الكلمة الناقصة لم تُنفذ بعد هنا)</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
