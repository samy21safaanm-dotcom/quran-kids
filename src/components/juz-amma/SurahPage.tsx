'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Surah, Ayah } from '@/lib/juzAmmaData';
import { RECITERS } from '@/lib/juzAmmaData';

interface Props {
  surah:  Surah;
  ayat:   Ayah[];
  onBack: () => void;
}

const RECITER_SERVERS: Record<string, string> = {
  minshawi: 'https://server10.mp3quran.net/minsh/',
  afasy:    'https://server10.mp3quran.net/Afasy/',
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

function Particle({ color }: { color: string }) {
  return (
    <motion.div className="absolute rounded-full pointer-events-none"
      style={{ left: `${Math.random() * 100}%`, bottom: -10,
        width: Math.random() * 4 + 2, height: Math.random() * 4 + 2, background: color }}
      animate={{ y: [0, -(Math.random() * 300 + 200)], opacity: [0, 0.8, 0], scale: [0, 1, 0] }}
      transition={{ duration: Math.random() * 6 + 4, repeat: Infinity, delay: Math.random() * 5 }} />
  );
}

// ── Story Panel ───────────────────────────────────────────────────────────────
type StoryPhase = 'idle' | 'playing' | 'done';

function StoryPanel({ surah, accent }: { surah: Surah; accent: string }) {
  const [phase, setPhase] = useState<StoryPhase>('idle');
  const [videoError, setVideoError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = async () => {
    setPhase('playing');
    setVideoError(false);
    await new Promise(r => setTimeout(r, 80));
    try { await videoRef.current?.play(); setPlaying(true); } catch { /* needs gesture */ }
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
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (v && duration) {
      const pct = Number(e.target.value);
      v.currentTime = (pct / 100) * duration;
      setProgress(pct);
    }
  };

  // No video yet
  if (!surah.story) {
    return (
      <div className="relative w-full h-full overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${accent}12, rgba(124,58,237,0.15), rgba(2,8,23,0.9))` }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div key={i} className="absolute rounded-full pointer-events-none"
            style={{ width: Math.random() * 5 + 2, height: Math.random() * 5 + 2,
              left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, background: accent }}
            animate={{ opacity: [0, 0.4, 0], scale: [0, 1, 0], y: [0, -60, 0] }}
            transition={{ duration: Math.random() * 5 + 4, repeat: Infinity, delay: Math.random() * 5 }} />
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
      <video ref={videoRef} src={`/videos/${surah.story}`}
        className="absolute inset-0 w-full h-full"
        style={{ objectFit: 'cover', opacity: phase === 'playing' && !videoError ? 1 : 0,
          transition: 'opacity 0.5s ease', pointerEvents: phase === 'playing' ? 'auto' : 'none' }}
        playsInline onEnded={handleEnded} onError={handleError}
        onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} />
      {/* Controls */}
      {phase === 'playing' && !videoError && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center w-full max-w-xl">
          <input type="range" min="0" max="100" value={progress} onChange={handleSeek}
            className="w-full accent-yellow-400" />
          <div className="flex items-center gap-4 mt-2">
            <button onClick={playing ? handlePause : handlePlay}
              className="bg-yellow-400 text-purple-900 rounded-full px-5 py-2 font-black text-lg shadow">
              {playing ? '⏸ إيقاف مؤقت' : '▶ تشغيل'}
            </button>
            <button onClick={handleReplay}
              className="bg-white/80 text-purple-900 rounded-full px-4 py-2 font-bold text-base border border-yellow-400 ml-2">
              ↺ إعادة
            </button>
          </div>
        </div>
      )}

      {/* Stop button while playing */}
      <AnimatePresence>
        {phase === 'playing' && !videoError && (
          <motion.button className="absolute top-4 left-4 z-20 glass-card px-3 py-1.5 rounded-full text-white/60 hover:text-white text-xs font-bold"
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
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div key={i} className="absolute rounded-full pointer-events-none"
                style={{ width: Math.random() * 5 + 2, height: Math.random() * 5 + 2,
                  left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, background: accent }}
                animate={{ opacity: [0, 0.5, 0], scale: [0, 1, 0], y: [0, -50, 0] }}
                transition={{ duration: Math.random() * 4 + 3, repeat: Infinity, delay: Math.random() * 4 }} />
            ))}
            <motion.div className="text-8xl relative z-10"
              animate={{ y: [-10, 10, -10], rotate: [-4, 4, -4] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}>
              🐘
            </motion.div>
            <div className="relative z-10 px-6">
              <h3 className="text-white font-black text-2xl mb-2">🎬 قصة سورة {surah.name}</h3>
              <p className="text-white/50 text-sm">تجربة سينمائية مذهلة للأطفال</p>
            </div>
              <p className="text-white/30 text-sm relative z-10 px-6" style={{ fontFamily: 'Amiri, serif' }}>
                {surah.id === 105 && '﴿ أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ ﴾'}
                {surah.id === 112 && '﴿ قُلْ هُوَ اللَّهُ أَحَدٌ ﴾'}
                {surah.id === 113 && '﴿ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ﴾'}
              </p>
            <motion.button onClick={handlePlay}
              className="relative z-10 flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-lg text-black"
              style={{ background: `linear-gradient(135deg, ${accent}, #F5C842)` }}
              whileHover={{ scale: 1.08, y: -4 }} whileTap={{ scale: 0.95 }}
              animate={{ boxShadow: [`0 0 20px ${accent}50`, `0 0 50px ${accent}80`, `0 0 20px ${accent}50`] }}
              transition={{ duration: 2, repeat: Infinity }}>
              <span className="text-2xl">▶</span>
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
            <div className="text-6xl">🐘</div>
            <p className="text-white font-black text-xl">قصة أصحاب الفيل</p>
            <p className="text-white/50 text-sm text-center px-6">
              ضع ملف الفيديو في:<br />
              <code className="text-yellow-400 text-xs">public/videos/{surah.story}</code>
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
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
              {surah.id === 112 && (
                <motion.button className="px-7 py-3 rounded-2xl font-black text-base text-black"
                  style={{ background: `linear-gradient(135deg, ${accent}, #F5C842)` }}
                  whileHover={{ scale: 1.06, y: -2 }} whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/challenge/ikhlaas-challenge'}>
                  ابدأ التحدي 🚀
                </motion.button>
              )}
              <motion.button onClick={handleReplay}
                className="px-5 py-3 rounded-2xl font-bold text-sm text-white/60 hover:text-white glass-card"
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}>
                ↺ إعادة
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function SurahPage({ surah, ayat, onBack }: Props) {
  const [activeAyah,  setActiveAyah]  = useState<number | null>(null);
  const [reciterId,   setReciterId]   = useState(RECITERS[0].id);
  const [showRecMenu, setShowRecMenu] = useState(false);

  const accent  = surah.color;
  const reciter = RECITERS.find(r => r.id === reciterId) ?? RECITERS[0];
  const player  = useAudioPlayer(surahAudioUrl(RECITER_SERVERS[reciterId], surah.id));

  return (
    <motion.div className="fixed inset-0 z-50 overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>

      {/* Background */}
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse at 30% 20%, ${surah.glow.replace('0.5','0.2')} 0%, transparent 60%),
                     radial-gradient(ellipse at 70% 80%, rgba(124,58,237,0.15) 0%, transparent 60%),
                     linear-gradient(180deg, #0a0520 0%, #0d1b3e 50%, #020817 100%)`,
      }} />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => <Particle key={i} color={accent} />)}
        <motion.div className="absolute rounded-full blur-3xl"
          style={{ width: '40vw', height: '40vw', top: '5%', right: '5%',
            background: `radial-gradient(ellipse, ${surah.glow.replace('0.5','0.15')} 0%, transparent 70%)` }}
          animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 7, repeat: Infinity }} />
      </div>
      <div className="absolute inset-0 islamic-pattern opacity-5 pointer-events-none" />

      {/* Layout */}
      <div className="relative z-10 h-full flex flex-col">

        {/* Header */}
        <motion.div className="flex-shrink-0 px-6 pt-4 pb-3"
          style={{ background: 'linear-gradient(to bottom, rgba(10,5,32,0.97) 80%, transparent)' }}
          initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="flex items-center justify-between max-w-screen-xl mx-auto" dir="ltr">
            <motion.button onClick={onBack}
              className="flex items-center gap-2 glass-card px-4 py-2 rounded-full text-white/70 hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <span>←</span><span className="text-sm font-medium">جزء عم</span>
            </motion.button>
            <div className="text-center" dir="rtl">
              <h1 className="text-2xl font-black text-white">سورة {surah.name}</h1>
              <p className="text-xs" style={{ color: accent }}>{surah.ayat} آيات • {surah.type} • {surah.nameEn}</p>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-2xl"
              style={{ background: `${accent}20`, border: `1px solid ${accent}40` }}>
              {surah.icon}
            </div>
          </div>
        </motion.div>

        {/* Body — 50/50 */}
        <div className="flex-1 overflow-hidden flex min-h-0" dir="ltr">

          {/* LEFT — Story */}
          <motion.div className="hidden lg:flex flex-col flex-shrink-0"
            style={{ width: '50%', borderRight: `1px solid ${accent}25`, overflow: 'hidden' }}
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
            <div style={{ width: '100%', height: '100%' }}>
              <StoryPanel surah={surah} accent={accent} />
            </div>
          </motion.div>

          {/* RIGHT — Surah content */}
          <div className="overflow-y-auto" style={{ width: '50%' }} dir="rtl">
            <div className="px-4 pb-20">

              {/* Bismillah */}
              <motion.div className="text-center py-6"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
                <motion.p className="bismillah-text" style={{ textShadow: `0 0 30px ${accent}60` }}
                  animate={{ textShadow: [`0 0 20px ${accent}40`, `0 0 50px ${accent}80`, `0 0 20px ${accent}40`] }}
                  transition={{ duration: 3, repeat: Infinity }}>
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </motion.p>
              </motion.div>

              {/* Mobile story */}
              {surah.story && (
                <motion.div className="lg:hidden mb-6 rounded-2xl overflow-hidden"
                  style={{ minHeight: 280, background: `${accent}10`, border: `1px solid ${accent}25` }}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                  <StoryPanel surah={surah} accent={accent} />
                </motion.div>
              )}

              {/* Audio Player */}
              <motion.div className="glass-card rounded-3xl p-5 mb-6 border"
                style={{ borderColor: `${accent}30` }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xl">🎵</span>
                  <h3 className="text-white font-bold">مشغل التلاوة</h3>
                  {player.loading && (
                    <motion.div className="w-4 h-4 rounded-full border-2 border-t-transparent mr-auto"
                      style={{ borderColor: accent }} animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                  )}
                  {player.error && <span className="text-red-400 text-xs mr-auto">تعذّر تحميل الصوت</span>}
                </div>

                {/* Reciter */}
                <div className="relative mb-4">
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
                  {Array.from({ length: 40 }).map((_, i) => (
                    <motion.div key={i} className="rounded-full" style={{ width: 3, background: accent }}
                      animate={player.playing ? { height: [4, Math.random() * 28 + 4, 4], opacity: [0.4, 1, 0.4] } : { height: 4, opacity: 0.25 }}
                      transition={{ duration: 0.35 + Math.random() * 0.4, repeat: Infinity, delay: i * 0.025 }} />
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
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 flex-1">
                    <button onClick={() => player.setVolume(player.volume === 0 ? 0.9 : 0)}
                      className="text-white/50 hover:text-white text-lg">
                      {player.volume === 0 ? '🔇' : player.volume < 0.5 ? '🔉' : '🔊'}
                    </button>
                    <input type="range" min={0} max={1} step={0.05} value={player.volume}
                      onChange={e => player.setVolume(Number(e.target.value))}
                      className="w-20 h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{ accentColor: accent }} />
                  </div>
                  <motion.button onClick={player.toggle}
                    className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold shadow-2xl flex-shrink-0"
                    style={{ background: player.error ? '#374151' : `linear-gradient(135deg, ${accent}, #F5C842)` }}
                    whileHover={{ scale: player.error ? 1 : 1.1 }} whileTap={{ scale: 0.9 }}
                    animate={player.playing ? { boxShadow: [`0 0 15px ${accent}60`, `0 0 40px ${accent}90`, `0 0 15px ${accent}60`] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }} disabled={player.error}>
                    {player.loading
                      ? <motion.div className="w-5 h-5 rounded-full border-2 border-t-transparent border-white" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                      : player.playing ? '⏸' : '▶'}
                  </motion.button>
                  <div className="flex-1 text-left">
                    <p className="text-white/40 text-xs">سورة {surah.name}</p>
                    <p className="text-white/30 text-xs">{reciter.name}</p>
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
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <div className="text-center border-b pb-4 mb-4" style={{ borderColor: `${accent}20` }}>
                  <p className="text-white/60 text-sm font-bold">سورة {surah.name}</p>
                  <div className="flex justify-center gap-4 mt-1 text-xs text-white/30">
                    <span>{surah.ayat} آيات</span><span>•</span><span>{surah.type}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  {ayat.map((ayah, i) => (
                    <motion.div key={ayah.number}
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.1 }}>
                      <motion.div className="rounded-2xl p-4 cursor-pointer"
                        style={{ background: activeAyah === ayah.number ? `${accent}15` : 'transparent',
                          border: `1px solid ${activeAyah === ayah.number ? accent + '40' : 'transparent'}` }}
                        onClick={() => setActiveAyah(activeAyah === ayah.number ? null : ayah.number)}
                        whileHover={{ background: `${accent}10` }}>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1"
                            style={{ background: `${accent}20`, border: `1px solid ${accent}40`, color: accent }}>
                            {ayah.number}
                          </div>
                          <p className="ayah-text flex-1">
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
                            <div className="mx-4 mb-3 p-4 rounded-2xl"
                              style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${accent}30` }}>
                              <div className="flex items-center gap-2 mb-2">
                                <span>💡</span>
                                <span className="text-xs font-bold" style={{ color: accent }}>التفسير الميسر</span>
                              </div>
                              <p className="text-white/80 text-sm leading-relaxed">{ayah.tafsir}</p>
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
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                <h3 className="text-white font-bold mb-4 flex items-center gap-2"><span>🏆</span> إنجازات السورة</h3>
                <div className="grid grid-cols-3 gap-3">
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
    </motion.div>
  );
}
