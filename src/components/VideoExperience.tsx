'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Character } from '@/lib/store';

interface Props {
  character: Character;
  onComplete: () => void;
}

type VideoState = 'loading' | 'playing' | 'error' | 'ending';

export default function VideoExperience({ character, onComplete }: Props) {
  const videoRef          = useRef<HTMLVideoElement>(null);
  const hasCalledComplete = useRef(false);

  const [videoState, setVideoState] = useState<VideoState>('loading');
  const [showSkip,   setShowSkip]   = useState(false);
  const [showText,   setShowText]   = useState(false);
  const [progress,   setProgress]   = useState(0);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 640px)').matches : false
  );

  const isNoor   = character === 'noor';
  const videoSrc = isNoor ? '/videos/noor-intro.mp4' : '/videos/lujain-intro.mp4';

  const introText = isNoor
    ? 'صالح — مرشدك في عالم نبأ 🌟'
    : 'هدى — رفيقتك في رحلة الإيمان 🌸';

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia('(max-width: 640px)');
    const onChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);

    setIsMobile(media.matches);
    media.addEventListener('change', onChange);

    return () => media.removeEventListener('change', onChange);
  }, []);

  const triggerComplete = useCallback(() => {
    if (hasCalledComplete.current) return;
    hasCalledComplete.current = true;
    setVideoState('ending');
    setTimeout(() => onComplete(), 900);
  }, [onComplete]);

  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const attemptPlay = () => {
      video.play()
        .then(() => {
          setVideoState('playing');
          setTimeout(() => setShowText(true), 1200);
        })
        .catch(() => {
          setVideoState('playing');
          setTimeout(() => setShowText(true), 800);
        });
    };
    if (video.readyState >= 3) {
      attemptPlay();
    } else {
      video.addEventListener('canplay', attemptPlay, { once: true });
    }
    return () => video.removeEventListener('canplay', attemptPlay);
  }, []);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setProgress((video.currentTime / video.duration) * 100);
  };

  const handleEnded  = () => triggerComplete();
  const handleError  = () => {
    setVideoState('error');
    setShowText(true);
    setShowSkip(true);
  };
  const handleSkip   = () => {
    const video = videoRef.current;
    if (video) { video.pause(); video.currentTime = video.duration || 0; }
    triggerComplete();
  };
  const handleTapPlay = () => videoRef.current?.play().catch(() => {});

  const isEnding = videoState === 'ending';

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: isEnding ? 0 : 1 }}
      transition={{ duration: isEnding ? 0.9 : 0.7, ease: 'easeInOut' }}
    >
      {videoState !== 'error' && (
        <video
          ref={videoRef}
          src={videoSrc}
          className={`absolute inset-0 w-full h-full ${isMobile ? 'object-contain' : 'object-cover'}`}
          style={{
            objectPosition: 'center center',
            transform: isMobile
              ? 'none'
              : (isNoor ? 'scale(1.1) translate(2%, 8%)' : 'scale(1.05)'),
            transformOrigin: 'center center',
          }}
          playsInline
          preload="auto"
          onEnded={handleEnded}
          onTimeUpdate={handleTimeUpdate}
          onError={handleError}
          onClick={handleTapPlay}
        />
      )}

      {videoState === 'error' && (
        <div className={`absolute inset-0 flex items-center justify-center ${
          isNoor
            ? 'bg-gradient-to-br from-[#020817] via-[#0A1628] to-[#0F2040]'
            : 'bg-gradient-to-br from-[#020817] via-[#1a0a2e] to-[#2d1b4e]'
        }`}>
          <motion.div
            className="text-center px-4"
            animate={{ y: [-12, 12, -12] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="text-[clamp(4rem,20vw,7.5rem)] leading-none mb-4 sm:mb-6">{isNoor ? '👦' : '👧'}</div>
            <p className="text-white text-[clamp(1.5rem,6vw,1.875rem)] font-black gold-text">{isNoor ? 'صالح' : 'هدى'}</p>
          </motion.div>
        </div>
      )}

      {/* Vignette */}
      <div className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.65) 100%)' }}
      />

      {/* Loading */}
      <AnimatePresence>
        {videoState === 'loading' && (
          <motion.div
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black"
            initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
          >
            <motion.div className="text-[clamp(2rem,8vw,3rem)] mb-4 sm:mb-6"
              animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >📖</motion.div>
            <motion.div
              className={`w-11 h-11 sm:w-14 sm:h-14 rounded-full border-[3px] sm:border-4 border-t-transparent mb-4 sm:mb-5 ${isNoor ? 'border-sky-400' : 'border-purple-400'}`}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
            />
            <p className="text-white/50 text-xs sm:text-sm font-medium">جاري تحميل المقدمة...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic text overlay */}
      <AnimatePresence>
        {showText && (
          <motion.div
            className="absolute inset-x-0 bottom-[clamp(4.25rem,12vh,5.5rem)] z-30 flex flex-col items-center gap-2 sm:gap-3 px-3 sm:px-6"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div
              className="flex items-center gap-2 sm:gap-3 mb-1"
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className={`h-px w-10 sm:w-14 md:w-16 ${isNoor ? 'bg-gradient-to-r from-transparent to-sky-400' : 'bg-gradient-to-r from-transparent to-purple-400'}`} />
              <span className={isNoor ? 'text-sky-400' : 'text-purple-400'}>{isNoor ? '🌟' : '🌸'}</span>
              <div className={`h-px w-10 sm:w-14 md:w-16 ${isNoor ? 'bg-gradient-to-l from-transparent to-sky-400' : 'bg-gradient-to-l from-transparent to-purple-400'}`} />
            </motion.div>

            <motion.div
              className="text-center w-full max-w-[min(92vw,44rem)] px-4 sm:px-6 py-3 sm:py-4 rounded-2xl"
              style={{
                background: 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(12px)',
                border: `1px solid ${isNoor ? 'rgba(14,165,233,0.3)' : 'rgba(124,58,237,0.3)'}`,
              }}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }}
            >
              <p className="text-[clamp(1rem,4.4vw,1.5rem)] font-black text-white leading-relaxed"
                style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>
                {introText}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar: يظهر دائماً */}
      <div className="absolute bottom-4 sm:bottom-6 inset-x-0 z-30 px-4 sm:px-8 md:px-10">
        <div className="h-0.5 bg-white/15 rounded-full overflow-hidden max-w-lg mx-auto">
          <motion.div
            className={`h-full rounded-full ${isNoor ? 'bg-sky-400' : 'bg-purple-400'}`}
            animate={{ width: `${progress}%` }}
            initial={false}
            transition={{ duration: 0.3 }}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Skip button */}
      <AnimatePresence>
        {showSkip && videoState !== 'loading' && videoState !== 'ending' && (
          <motion.button
            className="absolute top-3 sm:top-6 left-3 sm:left-6 z-40 text-white/60 hover:text-white px-3.5 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-colors min-h-11"
            style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
            onClick={handleSkip}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
          >
            تخطي ←
          </motion.button>
        )}
      </AnimatePresence>

      {/* Quran verse in top bar */}
      <AnimatePresence>
        {showText && (
          <motion.div
            className="absolute top-2 sm:top-4 inset-x-0 z-25 flex items-center justify-center pointer-events-none px-3"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
          >
            <p className="text-white/50 text-xs sm:text-sm text-center" style={{ fontFamily: 'Amiri, serif' }}>
              ﴿ نُورٌ عَلَىٰ نُورٍ ﴾
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
