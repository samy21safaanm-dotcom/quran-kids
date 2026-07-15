'use client';

import { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Surah, Ayah } from '@/lib/juzAmmaData';
import { RECITERS } from '@/lib/juzAmmaData';

interface Props {
  surah:  Surah;
  ayat:   Ayah[];
  onBack: () => void;
}

type TourTarget = 'audio' | 'reciter' | 'story' | 'ayat' | 'challenge';

interface TourStep {
  id: TourTarget;
  title: string;
  text: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'audio',
    title: 'مشغل التلاوة',
    text: 'من هنا تسمع السورة، اضغط زر التشغيل ▶ للإستماع.',
  },
  {
    id: 'reciter',
    title: 'اختيار القارئ',
    text: 'يمكنك التبديل بين المنشاوي والعفاسي بسهولة.',
  },
  {
    id: 'story',
    title: 'قصة السورة',
    text: 'كل سورة عندها قصة ممتعة تساعد الطفل على الفهم.',
  },
  {
    id: 'ayat',
    title: 'الآيات والتفسير',
    text: 'اضغط على أي آية ليظهر تفسيرها بطريقة مبسطة.',
  },
  {
    id: 'challenge',
    title: 'تحدي السورة',
    text: 'بعد التعلم اضغط ابدأ التحدي لتثبيت الحفظ والمهارة.',
  },
];

const RECITER_SERVERS: Record<string, string> = {
  minshawi: 'https://server10.mp3quran.net/minsh/',
  afasy:    'https://server8.mp3quran.net/afs/',
};

function surahAudioUrl(server: string, id: number) {
  return `${server}${String(id).padStart(3, '0')}.mp3`;
}

function useAudioPlayer(src: string) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing,  setPlaying]  = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume,   setVol]      = useState(0.9);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(false);

  useEffect(() => {
    const a = new Audio(); a.preload = 'metadata'; a.volume = volume;
    ref.current = a;
    const onT = () => { if (a.duration) setProgress((a.currentTime / a.duration) * 100); };
    const onD = () => setDuration(a.duration);
    const onE = () => { setPlaying(false); setProgress(0); };
    const onW = () => setLoading(true);
    const onC = () => { setLoading(false); setError(false); };
    const onX = () => { setLoading(false); setError(true); setPlaying(false); };
    a.addEventListener('timeupdate', onT); a.addEventListener('durationchange', onD);
    a.addEventListener('ended', onE); a.addEventListener('waiting', onW);
    a.addEventListener('canplay', onC); a.addEventListener('error', onX);
    return () => {
      a.pause(); a.src = '';
      a.removeEventListener('timeupdate', onT); a.removeEventListener('durationchange', onD);
      a.removeEventListener('ended', onE); a.removeEventListener('waiting', onW);
      a.removeEventListener('canplay', onC); a.removeEventListener('error', onX);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  const toggle = useCallback(async () => {
    const a = ref.current; if (!a) return;
    if (playing) { a.pause(); setPlaying(false); return; }
    setError(false); setLoading(true);
    if (!a.src || a.src !== src) { a.src = src; a.load(); }
    try { await a.play(); setPlaying(true); setLoading(false); }
    catch { setLoading(false); setError(true); }
  }, [playing, src]);

  const seek = useCallback((pct: number) => {
    const a = ref.current; if (!a || !a.duration) return;
    a.currentTime = (pct / 100) * a.duration; setProgress(pct);
  }, []);

  const setVolume = useCallback((v: number) => {
    setVol(v); if (ref.current) ref.current.volume = v;
  }, []);

  const fmt = (s: number) => !s || isNaN(s) ? '0:00'
    : `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;

  return { playing, progress, duration, volume, loading, error, toggle, seek, setVolume, fmt,
    currentTime: ref.current?.currentTime ?? 0 };
}

function useTafsirNarrator() {
  const [activeAyah, setActiveAyah] = useState<number | null>(null);
  const [loadingAyah, setLoadingAyah] = useState<number | null>(null);
  const [available, setAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cacheRef = useRef<Map<number, string>>(new Map());
  const audioContextRef = useRef<AudioContext | null>(null);

  const closeToneContext = useCallback(() => {
    const ctx = audioContextRef.current;
    audioContextRef.current = null;
    if (!ctx) return;
    void ctx.close().catch(() => {});
  }, []);

  const applyBoyToneFilter = useCallback(async (audio: HTMLAudioElement) => {
    if (typeof window === 'undefined') return;
    const Ctx = window.AudioContext || ((window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);
    if (!Ctx) return;

    closeToneContext();

    try {
      const ctx = new Ctx();
      const source = ctx.createMediaElementSource(audio);

      // Boost low frequencies and trim highs to shift the timbre toward young-boy voice.
      const lowShelf = ctx.createBiquadFilter();
      lowShelf.type = 'lowshelf';
      lowShelf.frequency.value = 230;
      lowShelf.gain.value = 6;

      const peaking = ctx.createBiquadFilter();
      peaking.type = 'peaking';
      peaking.frequency.value = 1200;
      peaking.Q.value = 0.9;
      peaking.gain.value = -2.5;

      const highShelf = ctx.createBiquadFilter();
      highShelf.type = 'highshelf';
      highShelf.frequency.value = 3200;
      highShelf.gain.value = -6;

      source.connect(lowShelf);
      lowShelf.connect(peaking);
      peaking.connect(highShelf);
      highShelf.connect(ctx.destination);

      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      audioContextRef.current = ctx;
    } catch {
      closeToneContext();
    }
  }, [closeToneContext]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setAvailable(false);
      return;
    }
    setAvailable(true);

    return () => {
      const active = audioRef.current;
      if (active) {
        active.pause();
        active.currentTime = 0;
      }
      closeToneContext();
      for (const url of cacheRef.current.values()) {
        URL.revokeObjectURL(url);
      }
      cacheRef.current.clear();
    };
  }, [closeToneContext]);

  const stop = useCallback(() => {
    const active = audioRef.current;
    if (active) {
      active.pause();
      active.currentTime = 0;
    }
    closeToneContext();
    setActiveAyah(null);
    setLoadingAyah(null);
  }, [closeToneContext]);

  const speak = useCallback(async (ayahNumber: number, tafsir: string) => {
    if (!tafsir.trim()) return;

    if (activeAyah === ayahNumber) {
      stop();
      return;
    }

    setError(null);
    stop();
    setLoadingAyah(ayahNumber);

    try {
      let blobUrl = cacheRef.current.get(ayahNumber);
      if (!blobUrl) {
        const res = await fetch('/api/tafsir-tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: tafsir }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'تعذّر توليد صوت التفسير.');
        }

        const audioBlob = await res.blob();
        blobUrl = URL.createObjectURL(audioBlob);
        cacheRef.current.set(ayahNumber, blobUrl);
      }

      const audio = new Audio(blobUrl);
      audio.preload = 'auto';
      audio.playbackRate = 0.82;
      (audio as HTMLAudioElement & {
        preservesPitch?: boolean;
        mozPreservesPitch?: boolean;
        webkitPreservesPitch?: boolean;
      }).preservesPitch = false;
      (audio as HTMLAudioElement & { mozPreservesPitch?: boolean }).mozPreservesPitch = false;
      (audio as HTMLAudioElement & { webkitPreservesPitch?: boolean }).webkitPreservesPitch = false;
      audio.onended = () => {
        setActiveAyah(null);
        closeToneContext();
      };
      audio.onerror = () => {
        setError('تعذّر تشغيل الصوت المولّد.');
        setActiveAyah(null);
        closeToneContext();
      };

      audioRef.current = audio;
      setActiveAyah(ayahNumber);
      await applyBoyToneFilter(audio);
      await audio.play();
    } catch (err) {
      setActiveAyah(null);
      setAvailable(false);
      closeToneContext();
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('تعذّر تشغيل صوت التفسير.');
      }
    } finally {
      setLoadingAyah(null);
    }
  }, [activeAyah, applyBoyToneFilter, closeToneContext, stop]);

  return { available, activeAyah, loadingAyah, error, speak, stop };
}

function Particle({
  color,
  left,
  bottom,
  size,
  lift,
  duration,
  delay,
}: {
  color: string;
  left: number;
  bottom: number;
  size: number;
  lift: number;
  duration: number;
  delay: number;
}) {
  return (
    <motion.div className="absolute rounded-full pointer-events-none"
      style={{ left: `${left}%`, bottom,
        width: size, height: size, background: color }}
      animate={{ y: [0, -lift], opacity: [0, 0.8, 0], scale: [0, 1, 0] }}
      transition={{ duration, repeat: Infinity, delay }} />
  );
}

function StoryJumpButton({ accent, onPlayStory }: { accent: string; onPlayStory?: () => void }) {
  const scrollToStory = () => {
    if (onPlayStory) {
      onPlayStory();
    }

    const storyEl = document.querySelector('[data-story-panel="true"]');
    if (storyEl) {
      storyEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.button
      type="button"
      onClick={scrollToStory}
      className="lg:hidden w-full mb-4 rounded-2xl px-4 py-3 font-black text-sm sm:text-base text-slate-950 min-h-11 shadow-2xl"
      style={{ background: `linear-gradient(135deg, ${accent}, #F5C842)`, boxShadow: `0 18px 40px ${accent}40` }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      ▶ شغّل القصة السينمائية
    </motion.button>
  );
}

// ── Story Panel ───────────────────────────────────────────────────────────────
type StoryPhase = 'idle' | 'playing' | 'done';

function getChallengeLink(surahId: number) {
  return `/challenge/${surahId}`;
}

function getStoryVideoSrc(surah: Surah) {
  const fileName = surah.story?.trim() ?? '';
  return fileName ? `/videos/${fileName}` : '';
}

const StoryPanel = memo(function StoryPanel({ surah, accent, onPlayReady, onPlayingChange }: { surah: Surah; accent: string; onPlayReady?: (play: () => void) => void; onPlayingChange?: (playing: boolean) => void }) {
  const [phase, setPhase] = useState<StoryPhase>('idle');
  const [videoError, setVideoError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const noStorySparkles = useMemo(
    () => Array.from({ length: 12 }, () => ({
      size: Math.random() * 5 + 2,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 5 + 4,
      delay: Math.random() * 5,
    })),
    [],
  );
  const idleSparkles = useMemo(
    () => Array.from({ length: 10 }, () => ({
      size: Math.random() * 5 + 2,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 4,
    })),
    [],
  );

  const handlePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    setPhase('playing');
    setVideoError(false);
    try {
      if (video.currentTime > 0 && Number.isFinite(video.duration) && video.duration > 0) {
        video.currentTime = 0;
      }
      video.muted = false;
      video.volume = 1;
      await video.play();
      setPlaying(true);
    } catch {
      setVideoError(true);
      setPhase('idle');
      setPlaying(false);
    }
  };
  const handlePause = () => {
    videoRef.current?.pause();
    setPlaying(false);
  };
  const handleEnded = () => { setPhase('done'); setPlaying(false); };
  const handleError = () => setVideoError(true);
  const handleReplay = () => {
    setPhase('idle'); setVideoError(false); setPlaying(false);
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
  };
  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (v && v.duration) setProgress((v.currentTime / v.duration) * 100);
  };
  const handleLoadedMetadata = () => {
    const v = videoRef.current;
    if (v) setDuration(v.duration);
  };
  const handleCanPlay = () => {
    // Keep handler minimal to avoid interfering with user-initiated playback.
  };
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (v && duration) {
      const pct = Number(e.target.value);
      v.currentTime = (pct / 100) * duration;
      setProgress(pct);
    }
  };

  useEffect(() => {
    if (!onPlayReady) return;
    onPlayReady(() => {
      void handlePlay();
    });
  }, [handlePlay, onPlayReady]);

  useEffect(() => {
    onPlayingChange?.(phase === 'playing');
  }, [onPlayingChange, phase]);

  // No video yet
  if (!surah.story) {
    return (
      <div className="relative w-full h-full overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${accent}12, rgba(124,58,237,0.15), rgba(2,8,23,0.9))` }}>
        {noStorySparkles.map((sparkle, i) => (
          <motion.div key={i} className="absolute rounded-full pointer-events-none"
            style={{ width: sparkle.size, height: sparkle.size,
              left: `${sparkle.left}%`, top: `${sparkle.top}%`, background: accent }}
            animate={{ opacity: [0, 0.4, 0], scale: [0, 1, 0], y: [0, -60, 0] }}
            transition={{ duration: sparkle.duration, repeat: Infinity, delay: sparkle.delay }} />
        ))}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-center px-6">
          <motion.div className="text-8xl"
            animate={{ y: [-8, 8, -8], rotate: [-3, 3, -3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
            {surah.icon}
          </motion.div>
          <div>
            <h3 className="text-white font-black text-2xl mb-2">سورة {surah.name}</h3>
            <p className="text-white/40 text-sm">{surah.ayat} آيات • {surah.type}</p>
          </div>
          <motion.div className="px-6 py-3 rounded-2xl"
            style={{ background: `${accent}20`, border: `1px solid ${accent}40` }}
            animate={{ boxShadow: [`0 0 15px ${accent}30`, `0 0 35px ${accent}50`, `0 0 15px ${accent}30`] }}
            transition={{ duration: 2.5, repeat: Infinity }}>
            <p className="text-white/70 text-sm font-bold">🎬 القصة السينمائية قادمة قريباً</p>
          </motion.div>
          <p className="text-white/20 text-xs px-4" style={{ fontFamily: 'Amiri, serif' }}>
            ﴿ وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ ﴾
          </p>
        </div>
      </div>
    );
  }

  const videoSrc = getStoryVideoSrc(surah);

  return (
    <div className="relative w-full h-full" style={{ minHeight: 0 }}>
      {/* Glow */}
      <AnimatePresence>
        {phase === 'playing' && (
          <motion.div className="absolute inset-0 pointer-events-none z-0"
            style={{ boxShadow: `inset 0 0 60px ${accent}30` }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
        )}
      </AnimatePresence>

      {/* Video */}
      <video ref={videoRef} src={videoSrc}
        className="absolute inset-0 w-full h-full"
        style={{ objectFit: 'cover', opacity: phase === 'playing' && !videoError ? 1 : 0,
          transition: 'opacity 0.5s ease', pointerEvents: phase === 'playing' ? 'auto' : 'none' }}
        playsInline preload="auto" onEnded={handleEnded} onError={handleError}
        onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={handleCanPlay} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
      {/* Controls */}
      {phase === 'playing' && !videoError && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center w-[calc(100%-0.75rem)] sm:w-full max-w-xl px-1.5 sm:px-4">
          <input type="range" min="0" max="100" value={progress} onChange={handleSeek}
            className="w-full accent-yellow-400" />
          <div className="flex items-center justify-center gap-2 mt-2 w-full rounded-2xl bg-slate-900/65 border border-white/20 backdrop-blur-md px-2 py-2 sm:w-auto sm:rounded-none sm:bg-transparent sm:border-0 sm:backdrop-blur-0 sm:px-0 sm:py-0">
            <button onClick={playing ? handlePause : handlePlay}
              className="bg-yellow-400 text-purple-900 rounded-full px-3 sm:px-5 py-1.5 sm:py-2 font-black text-xs sm:text-lg shadow min-h-9 sm:min-h-11 flex-1 sm:flex-none">
              <span className="sm:hidden">{playing ? '⏸ إيقاف' : '▶ تشغيل'}</span>
              <span className="hidden sm:inline">{playing ? '⏸ إيقاف مؤقت' : '▶ تشغيل'}</span>
            </button>
            <button onClick={handleReplay}
              className="bg-white/80 text-purple-900 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 font-bold text-xs sm:text-base border border-yellow-400 min-h-9 sm:min-h-11 flex-1 sm:flex-none">
              ↺ إعادة
            </button>
          </div>
        </div>
      )}

      {/* Stop button while playing */}
      <AnimatePresence>
        {phase === 'playing' && !videoError && (
          <motion.button className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20 glass-card px-3 py-2 rounded-full text-white/60 hover:text-white text-xs font-bold min-h-11"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleReplay} whileHover={{ scale: 1.05 }}>
            ✕ إيقاف
          </motion.button>
        )}
      </AnimatePresence>

      {/* IDLE preview */}
      <AnimatePresence>
        {phase === 'idle' && (
          <motion.div className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-center overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${accent}18, rgba(124,58,237,0.25), rgba(2,8,23,0.85))` }}
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}>
            {idleSparkles.map((sparkle, i) => (
              <motion.div key={i} className="absolute rounded-full pointer-events-none"
                style={{ width: sparkle.size, height: sparkle.size,
                  left: `${sparkle.left}%`, top: `${sparkle.top}%`, background: accent }}
                animate={{ opacity: [0, 0.5, 0], scale: [0, 1, 0], y: [0, -50, 0] }}
                transition={{ duration: sparkle.duration, repeat: Infinity, delay: sparkle.delay }} />
            ))}
            <motion.div className="text-8xl relative z-10"
              animate={{ y: [-10, 10, -10], rotate: [-4, 4, -4] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}>
              {surah.icon}
            </motion.div>
            <div className="relative z-10 px-5 sm:px-6">
              <h3 className="text-white font-black text-xl sm:text-2xl mb-2">🎬 قصة سورة {surah.name}</h3>
              <p className="text-white/50 text-sm">تجربة سينمائية مذهلة للأطفال</p>
            </div>
              <p className="text-white/30 text-sm relative z-10 px-6" style={{ fontFamily: 'Amiri, serif' }}>
                {surah.id === 105 && '﴿ أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ ﴾'}
                {surah.id === 110 && '﴿ إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ ﴾'}
                {surah.id === 112 && '﴿ قُلْ هُوَ اللَّهُ أَحَدٌ ﴾'}
                {surah.id === 113 && '﴿ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ﴾'}
              </p>
            <motion.button onClick={handlePlay}
              data-story-play="true"
              className="relative z-10 flex items-center gap-2 sm:gap-3 px-5 sm:px-8 py-3 sm:py-4 rounded-2xl font-black text-sm sm:text-lg text-black min-h-11"
              style={{ background: `linear-gradient(135deg, ${accent}, #F5C842)` }}
              whileHover={{ scale: 1.08, y: -4 }} whileTap={{ scale: 0.95 }}
              animate={{ boxShadow: [`0 0 20px ${accent}50`, `0 0 50px ${accent}80`, `0 0 20px ${accent}50`] }}
              transition={{ duration: 2, repeat: Infinity }}>
              <span className="text-lg sm:text-2xl">▶</span>
              <span>القصة السينمائية</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video error */}
      <AnimatePresence>
        {phase === 'playing' && videoError && (
          <motion.div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10"
            style={{ background: `linear-gradient(135deg, ${accent}18, rgba(2,8,23,0.9))` }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-6xl">{surah.icon}</div>
            <p className="text-white font-black text-xl">قصة أصحاب الفيل</p>
            <p className="text-white/50 text-sm text-center px-6">
              تعذر تشغيل القصة حالياً.<br />
              <code className="text-yellow-400 text-xs">public/videos/{getStoryVideoSrc(surah).replace('/videos/', '')}</code>
            </p>
            <motion.button onClick={handleReplay}
              className="px-6 py-2 rounded-xl text-sm font-bold text-black"
              style={{ background: `linear-gradient(135deg, ${accent}, #F5C842)` }}
              whileHover={{ scale: 1.05 }}>← رجوع</motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DONE */}
      <AnimatePresence>
        {phase === 'done' && (
          <motion.div className="absolute inset-0 flex flex-col items-center justify-center gap-5 z-10"
            style={{ background: 'linear-gradient(135deg, rgba(2,8,23,0.92), rgba(10,5,32,0.95))' }}
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}>
            <motion.div className="text-6xl"
              initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}>🌟</motion.div>
            <div className="text-center px-6">
              <motion.h3 className="text-white font-black text-2xl mb-2"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                أحسنت يا بطل! 🌟
              </motion.h3>
              <motion.p className="text-white/70 text-base"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                لقد تعلمت قصة سورة {surah.name}
              </motion.p>
            </div>
            <motion.div className="flex gap-2"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
              {[0, 0.15, 0.3].map((d, i) => (
                <motion.span key={i} className="text-3xl"
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, delay: 0.9 + d }}>⭐</motion.span>
              ))}
            </motion.div>
            <motion.div className="flex gap-3"
              style={{ flexWrap: 'wrap', justifyContent: 'center' }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
              <motion.button className="px-6 sm:px-7 py-3 rounded-2xl font-black text-sm sm:text-base text-black min-h-11"
                style={{ background: `linear-gradient(135deg, ${accent}, #F5C842)` }}
                whileHover={{ scale: 1.06, y: -2 }} whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = getChallengeLink(surah.id)}>
                ابدأ التحدي 🚀
              </motion.button>
              <motion.button onClick={handleReplay}
                className="px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm text-white/60 hover:text-white glass-card min-h-11"
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}>
                ↺ إعادة
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function SurahPage({ surah, ayat, onBack }: Props) {
  const [activeAyah,  setActiveAyah]  = useState<number | null>(null);
  const [reciterId,   setReciterId]   = useState(RECITERS[0].id);
  const [showRecMenu, setShowRecMenu] = useState(false);
  const [showTour,    setShowTour]    = useState(false);
  const [tourStep,    setTourStep]    = useState(0);
  const [isStoryPlaying, setIsStoryPlaying] = useState(false);

  const audioCardRef = useRef<HTMLDivElement | null>(null);
  const reciterRef = useRef<HTMLDivElement | null>(null);
  const storyRef = useRef<HTMLDivElement | null>(null);
  const ayatRef = useRef<HTMLDivElement | null>(null);
  const challengeRef = useRef<HTMLDivElement | null>(null);
  const playStoryRef = useRef<(() => void) | null>(null);
  const backgroundParticles = useMemo(
    () => Array.from({ length: 20 }, () => ({
      left: Math.random() * 100,
      bottom: -10,
      size: Math.random() * 4 + 2,
      lift: Math.random() * 300 + 200,
      duration: Math.random() * 6 + 4,
      delay: Math.random() * 5,
    })),
    [],
  );
  const waveformBars = useMemo(
    () => Array.from({ length: 40 }, (_, i) => ({
      peak: Math.random() * 28 + 4,
      duration: 0.35 + Math.random() * 0.4,
      delay: i * 0.025,
    })),
    [],
  );

  const accent  = surah.color;
  const reciter = RECITERS.find(r => r.id === reciterId) ?? RECITERS[0];
  const player  = useAudioPlayer(surahAudioUrl(RECITER_SERVERS[reciterId], surah.id));
  const tafsirNarrator = useTafsirNarrator();

  const targetByStep: Record<TourTarget, React.RefObject<HTMLDivElement | null>> = {
    audio: audioCardRef,
    reciter: reciterRef,
    story: storyRef,
    ayat: ayatRef,
    challenge: challengeRef,
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const key = 'juz-amma-surah-tour-seen-v1';
    const seen = window.localStorage.getItem(key) === 'true';
    if (!seen) {
      setShowTour(true);
      setTourStep(0);
      window.localStorage.setItem(key, 'true');
    }
  }, []);

  useEffect(() => {
    if (!showTour) return;
    const current = TOUR_STEPS[tourStep];
    const el = targetByStep[current.id].current;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [showTour, tourStep]);

  const isStepActive = useCallback((id: TourTarget) => {
    if (!showTour) return false;
    return TOUR_STEPS[tourStep]?.id === id;
  }, [showTour, tourStep]);

  const nextTourStep = useCallback(() => {
    setTourStep(prev => {
      if (prev >= TOUR_STEPS.length - 1) {
        setShowTour(false);
        return prev;
      }
      return prev + 1;
    });
  }, []);

  const prevTourStep = useCallback(() => {
    setTourStep(prev => Math.max(prev - 1, 0));
  }, []);

  useEffect(() => {
    if (activeAyah === null) {
      tafsirNarrator.stop();
    }
  }, [activeAyah, tafsirNarrator]);

  return (
    <motion.div className="fixed inset-0 z-[90] overflow-hidden"
      initial={false} animate={{ opacity: 1 }} exit={{ opacity: 1 }} transition={{ duration: 0 }}>

      {/* Background */}
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse at 30% 20%, ${surah.glow.replace('0.5','0.2')} 0%, transparent 60%),
                     radial-gradient(ellipse at 70% 80%, rgba(124,58,237,0.15) 0%, transparent 60%),
                     linear-gradient(180deg, #0a0520 0%, #0d1b3e 50%, #020817 100%)`,
      }} />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {backgroundParticles.map((particle, i) => (
          <Particle
            key={i}
            color={accent}
            left={particle.left}
            bottom={particle.bottom}
            size={particle.size}
            lift={particle.lift}
            duration={particle.duration}
            delay={particle.delay}
          />
        ))}
        <motion.div className="absolute rounded-full blur-3xl"
          style={{ width: '40vw', height: '40vw', top: '5%', right: '5%',
            background: `radial-gradient(ellipse, ${surah.glow.replace('0.5','0.15')} 0%, transparent 70%)` }}
          animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 7, repeat: Infinity }} />
      </div>
      <div className="absolute inset-0 islamic-pattern opacity-5 pointer-events-none" />

      {/* Layout */}
      <div className="relative z-10 h-full flex flex-col min-w-0">

        {/* Header */}
        <motion.div className="flex-shrink-0 px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 pb-2.5 sm:pb-3"
          style={{ background: 'linear-gradient(to bottom, rgba(10,5,32,0.97) 80%, transparent)' }}
          initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="flex items-center justify-between gap-2 sm:gap-3 max-w-screen-xl mx-auto min-w-0" dir="ltr">
            <motion.button onClick={onBack}
              className="flex items-center gap-1.5 sm:gap-2 glass-card px-3 sm:px-4 py-2 rounded-full text-white/70 hover:text-white transition-colors text-xs sm:text-sm min-h-11"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <span>←</span><span className="font-medium whitespace-nowrap">جزء عم</span>
            </motion.button>
            <div className="text-center min-w-0 flex-1 px-1" dir="rtl">
              <h1 className="text-[clamp(1rem,4.2vw,1.5rem)] font-black text-white truncate">سورة {surah.name}</h1>
              <p className="text-[10px] sm:text-xs truncate" style={{ color: accent }}>{surah.ayat} آيات • {surah.type} • {surah.nameEn}</p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xl sm:text-2xl flex-shrink-0"
              style={{ background: `${accent}20`, border: `1px solid ${accent}40` }}>
              {surah.icon}
            </div>
          </div>
        </motion.div>

        {/* Body — 50/50 */}
        <div className="flex-1 overflow-hidden flex min-h-0" dir="ltr">

          {/* LEFT — Story */}
          <motion.div className="hidden lg:flex w-1/2 flex-col flex-shrink-0"
            ref={storyRef}
            style={{ borderRight: `1px solid ${accent}25`, overflow: 'hidden' }}
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
            <div style={{ width: '100%', height: '100%' }}>
              <StoryPanel surah={surah} accent={accent} />
            </div>
          </motion.div>

          {/* RIGHT — Surah content */}
          <div className="overflow-y-auto w-full lg:w-1/2 min-w-0" dir="rtl">
            <div className="px-3 sm:px-4 pb-20 sm:pb-24">

                {surah.story && !isStoryPlaying && (
                  <StoryJumpButton accent={accent} onPlayStory={() => playStoryRef.current?.()} />
                )}

                {/* Mobile story (placed early so it is easy to find on phones) */}
                {surah.story && (
                  <motion.div
                    className="lg:hidden mb-6 rounded-3xl overflow-hidden border h-[320px] sm:h-[360px] flex flex-col"
                    data-story-panel="true"
                    ref={storyRef}
                    style={{ background: `${accent}10`, borderColor: `${accent}25` }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <div className="px-4 pt-4 pb-2 flex items-center gap-2 flex-shrink-0" dir="rtl">
                      <span className="text-lg">🎬</span>
                      <h3 className="text-white font-black text-sm sm:text-base">قصة السورة</h3>
                    </div>
                    <div className="px-2 pb-2 sm:px-3 sm:pb-3 flex-1 min-h-0">
                      <div className="h-full">
                        <StoryPanel
                          surah={surah}
                          accent={accent}
                          onPlayReady={(play) => { playStoryRef.current = play; }}
                          onPlayingChange={setIsStoryPlaying}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

              {/* Bismillah */}
              <motion.div className="text-center py-5 sm:py-6"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
                <motion.p className="bismillah-text" style={{ textShadow: `0 0 30px ${accent}60` }}
                  animate={{ textShadow: [`0 0 20px ${accent}40`, `0 0 50px ${accent}80`, `0 0 20px ${accent}40`] }}
                  transition={{ duration: 3, repeat: Infinity }}>
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </motion.p>
              </motion.div>

              {/* Audio Player */}
              <motion.div className="glass-card rounded-3xl p-3 sm:p-4 md:p-5 mb-6 border"
                ref={audioCardRef}
                style={{ borderColor: `${accent}30` }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                {isStepActive('audio') && (
                  <motion.div
                    className="mb-3 rounded-2xl px-3 py-2 text-xs font-bold"
                    style={{ background: `${accent}20`, border: `1px solid ${accent}60`, color: '#fff' }}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    👈 هذا هو مشغل التلاوة
                  </motion.div>
                )}
                <div className="flex items-center gap-2 sm:gap-3 mb-4 flex-wrap">
                  <span className="text-xl">🎵</span>
                  <h3 className="text-white font-bold text-sm sm:text-base">مشغل التلاوة</h3>
                  {player.loading && (
                    <motion.div className="w-4 h-4 rounded-full border-2 border-t-transparent mr-auto"
                      style={{ borderColor: accent }} animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                  )}
                  {player.error && <span className="text-red-400 text-xs mr-auto">تعذّر تحميل الصوت</span>}
                </div>

                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="text-[11px] px-2.5 py-1 rounded-full border border-yellow-400/35 bg-yellow-400/10 text-yellow-300">
                    🎙️ يوجد صوتان: المنشاوي + العفاسي
                  </span>
                  <span className="text-[11px] px-2.5 py-1 rounded-full border border-white/15 bg-white/5 text-white/70">
                    اختر القارئ ثم اضغط ▶
                  </span>
                </div>

                {/* Reciter */}
                <div
                  ref={reciterRef}
                  className="relative mb-4"
                  style={isStepActive('reciter') ? { border: `1px dashed ${accent}90`, borderRadius: 14, padding: 4 } : undefined}
                >
                  {isStepActive('reciter') && (
                    <motion.div className="mb-2 text-xs font-bold" style={{ color: '#FCD34D' }}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      👈 اضغط هنا لتغيير القارئ
                    </motion.div>
                  )}
                  <motion.button onClick={() => setShowRecMenu(v => !v)}
                    className="w-full flex items-center justify-between glass-card rounded-xl px-4 py-3 text-white hover:bg-white/10 transition-all"
                    whileHover={{ scale: 1.01 }}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🎙️</span>
                      <div className="text-right">
                        <p className="font-bold text-sm">{reciter.name}</p>
                        <p className="text-white/50 text-xs">{reciter.style}</p>
                      </div>
                    </div>
                    <span className="text-white/40">{showRecMenu ? '▲' : '▼'}</span>
                  </motion.button>
                  <AnimatePresence>
                    {showRecMenu && (
                      <motion.div className="absolute top-full mt-2 left-0 right-0 z-20 glass-card rounded-xl overflow-hidden border border-white/10"
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        {RECITERS.map(r => (
                          <button key={r.id} onClick={() => { setReciterId(r.id); setShowRecMenu(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-right hover:bg-white/10 transition-all ${reciterId === r.id ? 'bg-yellow-400/10' : ''}`}>
                            <span>🎙️</span>
                            <div><p className="text-white font-bold text-sm">{r.name}</p><p className="text-white/50 text-xs">{r.style}</p></div>
                            {reciterId === r.id && <span className="mr-auto text-yellow-400">✓</span>}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Waveform */}
                <div className="flex items-center justify-center gap-0.5 h-10 mb-3">
                  {waveformBars.map((bar, i) => (
                    <motion.div key={i} className="rounded-full" style={{ width: 3, background: accent }}
                      animate={player.playing ? { height: [4, bar.peak, 4], opacity: [0.4, 1, 0.4] } : { height: 4, opacity: 0.25 }}
                      transition={{ duration: bar.duration, repeat: Infinity, delay: bar.delay }} />
                  ))}
                </div>

                {/* Progress */}
                <div className="h-2.5 bg-white/10 rounded-full overflow-hidden mb-2 cursor-pointer"
                  onClick={e => { const r = e.currentTarget.getBoundingClientRect(); player.seek(((e.clientX - r.left) / r.width) * 100); }}>
                  <motion.div className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${accent}, #F5C842)`, width: `${player.progress}%` }} />
                </div>
                <div className="flex justify-between text-xs text-white/40 mb-4">
                  <span>{player.fmt(player.currentTime)}</span>
                  <span>{player.fmt(player.duration)}</span>
                </div>

                {/* Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 flex-1 min-w-0 sm:min-w-[7rem]">
                    <button onClick={() => player.setVolume(player.volume === 0 ? 0.9 : 0)}
                      className="text-white/50 hover:text-white text-lg">
                      {player.volume === 0 ? '🔇' : player.volume < 0.5 ? '🔉' : '🔊'}
                    </button>
                    <input type="range" min={0} max={1} step={0.05} value={player.volume}
                      onChange={e => player.setVolume(Number(e.target.value))}
                      className="w-full max-w-24 sm:max-w-20 h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{ accentColor: accent }} />
                  </div>
                  <motion.button onClick={player.toggle}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold shadow-2xl flex-shrink-0"
                    style={{ background: player.error ? '#374151' : `linear-gradient(135deg, ${accent}, #F5C842)` }}
                    whileHover={{ scale: player.error ? 1 : 1.1 }} whileTap={{ scale: 0.9 }}
                    animate={player.playing ? { boxShadow: [`0 0 15px ${accent}60`, `0 0 40px ${accent}90`, `0 0 15px ${accent}60`] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }} disabled={player.error}>
                    {player.loading
                      ? <motion.div className="w-5 h-5 rounded-full border-2 border-t-transparent border-white" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                      : player.playing ? '⏸' : '▶'}
                  </motion.button>
                  <div className="flex-1 text-left min-w-0 sm:min-w-[7rem]">
                    <p className="text-white/40 text-xs">سورة {surah.name}</p>
                    <p className="text-white/30 text-xs truncate">{reciter.name}</p>
                  </div>
                </div>
                {player.error && (
                  <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
                    <p className="text-red-400 text-xs">تعذّر تحميل الصوت. تأكد من اتصالك بالإنترنت.</p>
                    <button onClick={player.toggle} className="mt-1 text-xs text-white/60 hover:text-white underline">إعادة المحاولة</button>
                  </div>
                )}
              </motion.div>

              {/* Ayat */}
              <motion.div className="mushaf-container mb-6"
                ref={ayatRef}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <div className="text-center border-b pb-4 mb-4" style={{ borderColor: `${accent}20` }}>
                  <p className="text-white/60 text-sm font-bold">سورة {surah.name}</p>
                  <div className="flex justify-center gap-4 mt-1 text-xs text-white/30">
                    <span>{surah.ayat} آيات</span><span>•</span><span>{surah.type}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                    <span className="text-[11px] px-2.5 py-1 rounded-full border border-sky-300/35 bg-sky-400/10 text-sky-200">
                      👆 اضغط على الآية لعرض التفسير
                    </span>
                    <span className="text-[11px] px-2.5 py-1 rounded-full border border-emerald-300/35 bg-emerald-400/10 text-emerald-200">
                      🚀 بعد التعلم ابدأ تحدي السورة
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  {isStepActive('ayat') && (
                    <motion.div
                      className="mb-3 rounded-2xl px-3 py-2 text-xs font-bold"
                      style={{ background: `${accent}18`, border: `1px solid ${accent}55`, color: '#fff' }}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      👆 اضغط على أي آية ليظهر تفسيرها مباشرة
                    </motion.div>
                  )}
                  {ayat.map((ayah, i) => (
                    <motion.div key={ayah.number}
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.1 }}>
                      <motion.div className="rounded-2xl p-3 sm:p-4 cursor-pointer"
                        style={{ background: activeAyah === ayah.number ? `${accent}15` : 'transparent',
                          border: `1px solid ${activeAyah === ayah.number ? accent + '40' : 'transparent'}` }}
                        onClick={() => setActiveAyah(activeAyah === ayah.number ? null : ayah.number)}
                        whileHover={{ background: `${accent}10` }}>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1"
                            style={{ background: `${accent}20`, border: `1px solid ${accent}40`, color: accent }}>
                            {ayah.number}
                          </div>
                          <p className="ayah-text flex-1 min-w-0 break-words">
                            {ayah.arabic}
                            <span className="inline-block mr-2 text-lg" style={{ color: accent }}>۝{ayah.number}</span>
                          </p>
                        </div>
                        <div className="flex justify-end mt-2">
                          <motion.button className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full"
                            style={{ background: `${accent}20`, color: accent, border: `1px solid ${accent}30` }}
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={e => { e.stopPropagation(); player.toggle(); }}>
                            <span>{player.playing ? '⏸' : '▶'}</span><span>استمع</span>
                          </motion.button>
                        </div>
                      </motion.div>
                      <AnimatePresence mode="wait">
                        {activeAyah === ayah.number && (
                          <motion.div key={`tafsir-${ayah.number}`}
                            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35 }} className="overflow-hidden">
                            <div className="mx-2 sm:mx-4 mb-3 p-3 sm:p-4 rounded-2xl"
                              style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${accent}30` }}>
                              <div className="flex items-center gap-2 mb-2">
                                <span>💡</span>
                                <span className="text-xs font-bold" style={{ color: accent }}>التفسير الميسر</span>
                              </div>
                              <p className="text-white/80 text-sm leading-relaxed">{ayah.tafsir}</p>
                              <div className="mt-3 flex items-center gap-2 flex-wrap">
                                <button
                                  onClick={e => { e.stopPropagation(); tafsirNarrator.speak(ayah.number, ayah.tafsir); }}
                                  className="text-xs px-3 py-1.5 rounded-full font-bold"
                                  style={{
                                    background: tafsirNarrator.activeAyah === ayah.number ? `${accent}30` : `${accent}16`,
                                    color: '#fff',
                                    border: `1px solid ${accent}40`,
                                  }}
                                >
                                  {tafsirNarrator.loadingAyah === ayah.number
                                    ? '⏳ جاري تجهيز الصوت'
                                    : tafsirNarrator.activeAyah === ayah.number
                                      ? '⏹ إيقاف التفسير'
                                      : '🔊 استمع للتفسير'}
                                </button>
                                {!tafsirNarrator.available && (
                                  <span className="text-[11px] text-white/50">تعذّر الاتصال بخدمة الصوت. حاول مرة أخرى.</span>
                                )}
                                {tafsirNarrator.available && (
                                  <span className="text-[11px] text-white/45">وضع أطفال 4-6: خامة طفل ذكر مبسطة.</span>
                                )}
                                {tafsirNarrator.error && <span className="text-[11px] text-red-300">{tafsirNarrator.error}</span>}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {i < ayat.length - 1 && <div className="mx-6 h-px my-1" style={{ background: `${accent}15` }} />}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Achievements */}
              <motion.div className="glass-card rounded-3xl p-5 mb-6"
                ref={challengeRef}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                <h3 className="text-white font-bold mb-4 flex items-center gap-2"><span>🏆</span> إنجازات السورة</h3>
                {isStepActive('challenge') && (
                  <motion.div
                    className="mb-4 rounded-2xl px-3 py-2 text-xs font-bold"
                    style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.5)', color: '#D1FAE5' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    🚀 بعد الانتهاء اضغط الزر التالي لبدء تحدي السورة
                    <div className="mt-2">
                      <button
                        onClick={() => window.location.href = getChallengeLink(surah.id)}
                        className="px-3 py-1.5 rounded-xl text-black font-black text-xs"
                        style={{ background: 'linear-gradient(135deg, #34D399, #F5C842)' }}
                      >
                        ابدأ التحدي
                      </button>
                    </div>
                  </motion.div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { icon: '👂', label: 'استمعت', done: surah.progress > 0 },
                    { icon: '📖', label: 'قرأت',   done: surah.progress >= 50 },
                    { icon: '⭐', label: 'أتقنت',  done: surah.progress === 100 },
                  ].map(a => (
                    <div key={a.label} className={`rounded-2xl p-3 text-center ${a.done ? 'bg-yellow-400/15 border border-yellow-400/40' : 'bg-white/5 border border-white/10 opacity-50'}`}>
                      <div className="text-2xl mb-1">{a.icon}</div>
                      <p className={`text-xs font-bold ${a.done ? 'text-yellow-400' : 'text-white/40'}`}>{a.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </div>

      <motion.button
        onClick={() => { setShowTour(true); setTourStep(0); }}
        className="glass-card"
        style={{
          position: 'fixed',
          left: 16,
          bottom: 'max(16px, env(safe-area-inset-bottom))',
          zIndex: 60,
          borderRadius: 999,
          padding: '8px 12px',
          color: '#fff',
          fontSize: 12,
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>🧭</span>
        <span>جولة سريعة</span>
      </motion.button>

      <AnimatePresence>
        {showTour && (
          <motion.div
            className="fixed inset-0 z-[75] pointer-events-none"
            style={{ background: 'rgba(2,8,23,0.45)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-card pointer-events-auto"
              style={{
                position: 'fixed',
                right: 14,
                bottom: 14,
                width: 'min(420px, calc(100vw - 28px))',
                borderRadius: 20,
                padding: 14,
                border: `1px solid ${accent}60`,
              }}
              initial={{ opacity: 0, y: 14, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
            >
              <p className="text-[11px] text-white/50 mb-1">
                خطوة {tourStep + 1} من {TOUR_STEPS.length}
              </p>
              <h4 className="text-white font-black text-base mb-1">{TOUR_STEPS[tourStep].title}</h4>
              <p className="text-white/75 text-sm mb-3">{TOUR_STEPS[tourStep].text}</p>

              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => setShowTour(false)}
                  className="px-3 py-2 rounded-xl text-xs text-white/70 hover:text-white border border-white/20 min-h-11"
                >
                  تخطي
                </button>
                <div className="flex gap-2 flex-wrap justify-end">
                  <button
                    onClick={prevTourStep}
                    disabled={tourStep === 0}
                    className="px-3 py-2 rounded-xl text-xs border border-white/20 text-white disabled:opacity-40 min-h-11"
                  >
                    السابق
                  </button>
                  <button
                    onClick={nextTourStep}
                    className="px-3 py-2 rounded-xl text-xs font-black text-black min-h-11"
                    style={{ background: `linear-gradient(135deg, ${accent}, #F5C842)` }}
                  >
                    {tourStep === TOUR_STEPS.length - 1 ? 'إنهاء' : 'التالي'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
