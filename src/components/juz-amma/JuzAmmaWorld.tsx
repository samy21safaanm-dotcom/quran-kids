'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { JUZ_AMMA, type Surah } from '@/lib/juzAmmaData';
import type { Character } from '@/lib/store';

interface Props {
  character:     Character;
  childName:     string;
  stars:         number;
  level:         number;
  xp:            number;
  xpMax:         number;
  onSelectSurah: (surah: Surah) => void;
  onBack:        () => void;
}

function Cloud({ x, y, size, delay }: { x: string; y: string; size: number; delay: number }) {
  return (
    <motion.div className="absolute pointer-events-none" style={{ left: x, top: y }}
      animate={{ x: [0, 30, 0], opacity: [0.15, 0.3, 0.15] }}
      transition={{ duration: 12 + delay * 2, repeat: Infinity, delay, ease: 'easeInOut' }}>
      <div className="rounded-full bg-white/10 blur-2xl" style={{ width: size, height: size * 0.5 }} />
    </motion.div>
  );
}

function LightRiver({ top, delay }: { top: string; delay: number }) {
  return (
    <motion.div className="absolute left-0 right-0 pointer-events-none overflow-hidden" style={{ top }}>
      <motion.div className="h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(245,200,66,0.4), rgba(255,255,255,0.6), rgba(245,200,66,0.4), transparent)' }}
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 6 + delay, repeat: Infinity, delay, ease: 'linear' }} />
    </motion.div>
  );
}

export default function JuzAmmaWorld({
  character, childName, stars, level, xp, xpMax, onSelectSurah, onBack,
}: Props) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [filter,    setFilter]    = useState<'all' | 'done' | 'inprogress'>('all');
  const containerRef = useRef<HTMLDivElement>(null);
  const isNoor = character === 'noor';

  const filtered = JUZ_AMMA.filter(s => {
    if (filter === 'done')       return s.progress === 100;
    if (filter === 'inprogress') return s.progress > 0 && s.progress < 100;
    return true;
  });

  const totalProgress = Math.round(
    JUZ_AMMA.reduce((acc, s) => acc + s.progress, 0) / JUZ_AMMA.length,
  );

  return (
    <motion.div
      className="fixed inset-0 z-40 overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
    >
      {/* ── Background ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0520] via-[#0d1b3e] to-[#020817]" />

      {Array.from({ length: 60 }).map((_, i) => (
        <motion.div key={i} className="absolute rounded-full bg-white"
          style={{
            width:  Math.random() * 2.5 + 0.5,
            height: Math.random() * 2.5 + 0.5,
            left:   `${Math.random() * 100}%`,
            top:    `${Math.random() * 60}%`,
          }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 4 }} />
      ))}

      <Cloud x="5%"  y="8%"  size={300} delay={0} />
      <Cloud x="60%" y="5%"  size={250} delay={2} />
      <Cloud x="30%" y="15%" size={200} delay={4} />
      <Cloud x="75%" y="12%" size={350} delay={1} />
      <LightRiver top="25%" delay={0} />
      <LightRiver top="55%" delay={3} />
      <LightRiver top="80%" delay={1.5} />

      <div className="absolute inset-0 pointer-events-none">
        <motion.div className="absolute rounded-full blur-3xl"
          style={{ width: '80vw', height: '80vw', top: '10%', left: '10%', background: 'radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 8, repeat: Infinity }} />
        <motion.div className="absolute rounded-full blur-3xl"
          style={{ width: '50vw', height: '50vw', bottom: '5%', right: '5%', background: 'radial-gradient(ellipse, rgba(245,200,66,0.08) 0%, transparent 70%)' }}
          animate={{ scale: [1.1, 1, 1.1] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }} />
      </div>
      <div className="absolute inset-0 islamic-pattern opacity-5 pointer-events-none" />

      {/* ── Scrollable wrapper — FORCE LTR at every level ── */}
      <div
        ref={containerRef}
        className="relative z-10 h-full overflow-y-auto"
        style={{ direction: 'ltr' }}
      >
        <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 16px 64px' }}>

          {/* ── STICKY HEADER ── */}
          <motion.header
            className="sticky top-0 z-30"
            style={{
              paddingTop: 16,
              paddingBottom: 12,
              background: 'linear-gradient(to bottom, rgba(10,5,32,0.95) 80%, transparent)',
            }}
            initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}
          >
            {/* Absolute-positioned layout: back on left, title in TRUE centre, stats on right */}
            <div style={{ position: 'relative', height: 48, display: 'flex', alignItems: 'center' }}>

              {/* Left — back + logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, zIndex: 1 }}>
                <motion.button
                  onClick={onBack}
                  className="glass-card text-white/70 hover:text-white transition-colors"
                  style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                >
                  ←
                </motion.button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 20 }}>📖</span>
                  <div style={{ direction: 'rtl', textAlign: 'right' }}>
                    <p style={{ color: '#fff', fontWeight: 900, fontSize: 12, lineHeight: 1 }}>نور القرآن</p>
                    <p style={{ color: 'rgba(245,200,66,0.7)', fontSize: 11 }}>عالم جزء عم</p>
                  </div>
                </div>
              </div>

              {/* Centre — absolutely positioned so it's always in the middle of the full width */}
              <div style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                direction: 'rtl',
                whiteSpace: 'nowrap',
              }}>
                <span style={{ fontSize: 18 }}>🌙</span>
                <p style={{ color: '#fff', fontWeight: 900, fontSize: 16, lineHeight: 1 }}>عالم جزء عم</p>
                <span style={{ fontSize: 18 }}>🌙</span>
              </div>

              {/* Right — stats + avatar */}
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, zIndex: 1 }}>
                {/* Stars */}
                <div className="glass-card" style={{ padding: '6px 10px', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ color: '#F5C842', fontSize: 14 }}>⭐</span>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{stars}</span>
                </div>

                {/* XP */}
                <div className="glass-card" style={{ padding: '6px 10px', borderRadius: 12, minWidth: 110 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4, direction: 'rtl' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>المستوى {level}</span>
                    <span style={{ color: '#F5C842' }}>{xp}/{xpMax}</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 999, overflow: 'hidden' }}>
                    <motion.div
                      style={{ height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, #F5C842, #F97316)' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(xp / xpMax) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>

                {/* Avatar */}
                <motion.div
                  style={{
                    width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
                    border: `2px solid ${isNoor ? 'rgba(14,165,233,0.6)' : 'rgba(124,58,237,0.6)'}`,
                  }}
                  animate={{ boxShadow: [
                    `0 0 10px ${isNoor ? 'rgba(14,165,233,0.4)' : 'rgba(124,58,237,0.4)'}`,
                    `0 0 25px ${isNoor ? 'rgba(14,165,233,0.7)' : 'rgba(124,58,237,0.7)'}`,
                    `0 0 10px ${isNoor ? 'rgba(14,165,233,0.4)' : 'rgba(124,58,237,0.4)'}`,
                  ]}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Image src={isNoor ? '/noor.png' : '/lujain.png'} alt={childName} width={40} height={40} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                </motion.div>
              </div>
            </div>
          </motion.header>

          {/* ── HERO ── */}
          <motion.div
            style={{ textAlign: 'center', padding: '32px 0' }}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}
          >
            <motion.div style={{ fontSize: 64, display: 'inline-block', marginBottom: 12 }}
              animate={{ y: [-6, 6, -6], rotate: [-3, 3, -3] }} transition={{ duration: 4, repeat: Infinity }}>
              🌙
            </motion.div>
            <h1 className="gold-text" style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', fontWeight: 900, marginBottom: 12, direction: 'rtl' }}>
              عالم جزء عم
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18, direction: 'rtl' }}>
              {JUZ_AMMA.length} سورة مباركة تنتظرك يا {childName}
            </p>

            {/* Progress card */}
            <motion.div
              className="glass-card"
              style={{ maxWidth: 384, margin: '20px auto 0', borderRadius: 16, padding: 16 }}
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8, direction: 'rtl' }}>
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>إجمالي التقدم</span>
                <span style={{ color: '#F5C842', fontWeight: 700 }}>{totalProgress}%</span>
              </div>
              <div style={{ height: 12, background: 'rgba(255,255,255,0.1)', borderRadius: 999, overflow: 'hidden' }}>
                <motion.div style={{ height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, #7C3AED, #F5C842, #0EA5E9)' }}
                  initial={{ width: 0 }} animate={{ width: `${totalProgress}%` }} transition={{ duration: 1.5, delay: 0.8 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: 'rgba(255,255,255,0.4)', direction: 'rtl' }}>
                <span>{JUZ_AMMA.filter(s => s.progress === 100).length} مكتملة</span>
                <span>{JUZ_AMMA.filter(s => s.progress > 0 && s.progress < 100).length} جارية</span>
                <span>{JUZ_AMMA.filter(s => s.progress === 0).length} لم تبدأ</span>
              </div>
            </motion.div>
          </motion.div>

          {/* ── FILTER TABS ── */}
          <motion.div
            style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 32 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          >
            {([
              { key: 'all',        label: 'الكل',   icon: '📚' },
              { key: 'inprogress', label: 'جارية',  icon: '⚡' },
              { key: 'done',       label: 'مكتملة', icon: '✅' },
            ] as const).map(f => (
              <motion.button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={filter === f.key ? '' : 'glass-card'}
                style={{
                  padding: '8px 16px',
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  direction: 'rtl',
                  cursor: 'pointer',
                  border: filter === f.key ? '1px solid rgba(245,200,66,0.6)' : undefined,
                  background: filter === f.key ? 'rgba(245,200,66,0.2)' : undefined,
                  color: filter === f.key ? '#F5C842' : 'rgba(255,255,255,0.5)',
                }}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              >
                <span>{f.icon}</span><span>{f.label}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* ── SURAH GRID ── */}
          <motion.div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: 16,
              justifyContent: 'center',
            }}
            layout
          >
            <AnimatePresence>
              {filtered.map((surah, i) => (
                <SurahCard
                  key={surah.id}
                  surah={surah}
                  index={i}
                  isHovered={hoveredId === surah.id}
                  onHover={setHoveredId}
                  onSelect={onSelectSurah}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <motion.div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.4)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
              <p style={{ direction: 'rtl' }}>لا توجد سور في هذا التصنيف بعد</p>
            </motion.div>
          )}

        </div>
      </div>
    </motion.div>
  );
}

// ── Surah Card ────────────────────────────────────────────────────────────────
function SurahCard({ surah, index, isHovered, onHover, onSelect }: {
  surah: Surah; index: number; isHovered: boolean;
  onHover: (id: number | null) => void; onSelect: (s: Surah) => void;
}) {
  const isComplete   = surah.progress === 100;
  const isInProgress = surah.progress > 0 && surah.progress < 100;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ delay: index * 0.03, duration: 0.4, type: 'spring', stiffness: 200 }}
      style={{ position: 'relative', cursor: 'pointer' }}
      onHoverStart={() => onHover(surah.id)}
      onHoverEnd={() => onHover(null)}
      onClick={() => onSelect(surah)}
      whileHover={{ scale: 1.07, y: -6, zIndex: 10 }}
      whileTap={{ scale: 0.96 }}
    >
      {/* Glow */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            style={{ position: 'absolute', inset: -8, borderRadius: 24, filter: 'blur(16px)', pointerEvents: 'none', background: surah.glow }}
            initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Card */}
      <div style={{
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
        border: `1px solid ${isHovered ? surah.color + '80' : 'rgba(255,255,255,0.08)'}`,
        background: isHovered ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(16px)',
        transition: 'border-color 0.3s',
      }}>
        {/* Badges */}
        {isComplete   && <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10, width: 24, height: 24, borderRadius: '50%', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#fff' }}>✓</div>}
        {isInProgress && <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10, width: 24, height: 24, borderRadius: '50%', background: 'rgba(234,179,8,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>⚡</div>}
        {surah.story  && <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 10, background: 'rgba(124,58,237,0.8)', borderRadius: 999, padding: '2px 8px', fontSize: 11, color: '#fff', fontWeight: 700 }}>🎬</div>}

        <div style={{ padding: 16, direction: 'rtl', textAlign: 'center' }}>
          {/* Icon */}
          <motion.div style={{ fontSize: 40, marginBottom: 8, textAlign: 'center' }}
            animate={isHovered ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
            transition={{ duration: 0.6 }}>
            {surah.icon}
          </motion.div>

          {/* Number */}
          <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.6, color: surah.color, marginBottom: 2 }}>{surah.id}</div>

          {/* Name */}
          <h3 style={{ color: '#fff', fontWeight: 900, fontSize: 15, marginBottom: 4, lineHeight: 1.2 }}>{surah.name}</h3>

          {/* Meta */}
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginBottom: 8 }}>{surah.ayat} آية • {surah.type}</p>

          {/* Stars */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 8 }}>
            {[1, 2, 3].map(s => (
              <span key={s} style={{ fontSize: 14, color: s <= surah.stars ? '#F5C842' : 'rgba(255,255,255,0.15)' }}>★</span>
            ))}
          </div>

          {/* Progress */}
          <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 999, overflow: 'hidden' }}>
            <motion.div
              style={{ height: '100%', borderRadius: 999, background: surah.color, width: `${surah.progress}%` }}
              initial={{ width: 0 }} animate={{ width: `${surah.progress}%` }} transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
          {surah.progress > 0 && (
            <p style={{ textAlign: 'center', fontSize: 11, marginTop: 4, color: surah.color }}>{surah.progress}%</p>
          )}
        </div>

        {/* Hover shimmer */}
        {isHovered && (
          <motion.div
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `linear-gradient(135deg, ${surah.color}15, transparent 60%)` }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          />
        )}
      </div>
    </motion.div>
  );
}
