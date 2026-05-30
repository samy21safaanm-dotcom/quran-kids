'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CharacterNoor from './CharacterNoor';
import CharacterLujain from './CharacterLujain';
import type { Character } from '@/lib/store';

interface Props {
  onSelect: (character: Character) => void;
}

export default function GenderSelection({ onSelect }: Props) {
  const [hoveredCard,  setHoveredCard]  = useState<Character>(null);
  const [selectedCard, setSelectedCard] = useState<Character>(null);

  const handleSelect = (character: Character) => {
    setSelectedCard(character);
    setTimeout(() => onSelect(character), 800);
  };

  return (
    <motion.div
      className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8 z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6 }}
    >
      {/* Top gold line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-60" />

      {/* Decorations */}
      <motion.div className="absolute top-8 left-8 text-5xl"
        animate={{ rotate: [0, 10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity }}>🌙</motion.div>
      <motion.div className="absolute top-8 right-8 text-4xl"
        animate={{ rotate: [0, -10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}>⭐</motion.div>

      {/* Header */}
      <motion.div
        className="text-center mb-10 z-10"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.div
          className="flex items-center justify-center gap-3 mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
        >
          <span className="text-4xl animate-glow-pulse">📖</span>
          <h1 className="text-3xl md:text-4xl font-black gold-text">نور القرآن</h1>
          <span className="text-4xl animate-glow-pulse">✨</span>
        </motion.div>

        <motion.h2
          className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          مرحبًا بك في عالم{' '}
          <span className="gold-text">نور القرآن</span>{' '}
          <span className="inline-block animate-float">✨</span>
        </motion.h2>

        <motion.p
          className="text-lg md:text-xl text-blue-200 font-medium max-w-lg mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          اختر شخصيتك المفضلة وابدأ رحلتك الإيمانية
        </motion.p>

        <motion.div
          className="flex items-center justify-center gap-3 mt-4"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-yellow-400" />
          <span className="text-yellow-400 text-xl">❋</span>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-yellow-400" />
        </motion.div>
      </motion.div>

      {/* Character Cards */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 z-10 w-full max-w-4xl justify-center">

        {/* Noor Card */}
        <motion.div
          className="flex-1 max-w-sm mx-auto"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <motion.div
            className={`card-noor glass-card rounded-3xl p-6 cursor-pointer relative overflow-hidden transition-all duration-300 ${selectedCard === 'noor' ? 'scale-95 opacity-80' : ''}`}
            whileHover={{ scale: 1.04, y: -8 }}
            whileTap={{ scale: 0.97 }}
            onHoverStart={() => setHoveredCard('noor')}
            onHoverEnd={() => setHoveredCard(null)}
            onClick={() => handleSelect('noor')}
          >
            <AnimatePresence>
              {hoveredCard === 'noor' && (
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  style={{ background: 'radial-gradient(ellipse at center, rgba(14,165,233,0.15) 0%, transparent 70%)' }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>

            <div className="absolute top-4 left-4 bg-sky-500/20 border border-sky-400/40 rounded-full px-3 py-1">
              <span className="text-sky-300 text-sm font-bold">الولد</span>
            </div>

            <motion.div
              className="flex justify-center mb-4"
              animate={hoveredCard === 'noor' ? { y: [-5, 5, -5] } : { y: 0 }}
              transition={{ duration: 2, repeat: hoveredCard === 'noor' ? Infinity : 0 }}
            >
              <CharacterNoor size={200} glowing={hoveredCard === 'noor'} />
            </motion.div>

            <div className="text-center mb-2">
              <h3 className="text-3xl font-black text-white mb-1">نور</h3>
              <p className="text-sky-300 text-sm font-medium">الفتى المؤمن الشجاع</p>
            </div>

            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <motion.span key={i} className="text-yellow-400 text-lg"
                  animate={hoveredCard === 'noor' ? { scale: [1, 1.3, 1], rotate: [0, 20, 0] } : {}}
                  transition={{ delay: i * 0.1, duration: 0.5 }}>⭐</motion.span>
              ))}
            </div>

            <motion.button
              className="btn-gold w-full py-4 text-xl font-black rounded-2xl relative overflow-hidden"
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            >
              <span className="relative z-10">ابدأ مع نور 🌟</span>
              <motion.div className="absolute inset-0 bg-white/20"
                initial={{ x: '-100%' }} whileHover={{ x: '100%' }} transition={{ duration: 0.5 }} />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <motion.div
          className="hidden md:flex flex-col items-center justify-center gap-3"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-yellow-400/50 to-transparent" />
          <span className="text-yellow-400/60 text-2xl font-bold">أو</span>
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-yellow-400/50 to-transparent" />
        </motion.div>

        {/* Lujain Card */}
        <motion.div
          className="flex-1 max-w-sm mx-auto"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <motion.div
            className={`card-lujain glass-card rounded-3xl p-6 cursor-pointer relative overflow-hidden transition-all duration-300 ${selectedCard === 'lujain' ? 'scale-95 opacity-80' : ''}`}
            whileHover={{ scale: 1.04, y: -8 }}
            whileTap={{ scale: 0.97 }}
            onHoverStart={() => setHoveredCard('lujain')}
            onHoverEnd={() => setHoveredCard(null)}
            onClick={() => handleSelect('lujain')}
          >
            <AnimatePresence>
              {hoveredCard === 'lujain' && (
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  style={{ background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.15) 0%, transparent 70%)' }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>

            <div className="absolute top-4 left-4 bg-purple-500/20 border border-purple-400/40 rounded-full px-3 py-1">
              <span className="text-purple-300 text-sm font-bold">البنت</span>
            </div>

            <motion.div
              className="flex justify-center mb-4"
              animate={hoveredCard === 'lujain' ? { y: [-5, 5, -5] } : { y: 0 }}
              transition={{ duration: 2, repeat: hoveredCard === 'lujain' ? Infinity : 0 }}
            >
              <CharacterLujain size={200} glowing={hoveredCard === 'lujain'} />
            </motion.div>

            <div className="text-center mb-2">
              <h3 className="text-3xl font-black text-white mb-1">لجين</h3>
              <p className="text-purple-300 text-sm font-medium">الفتاة المؤمنة الذكية</p>
            </div>

            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <motion.span key={i} className="text-pink-400 text-lg"
                  animate={hoveredCard === 'lujain' ? { scale: [1, 1.3, 1], rotate: [0, -20, 0] } : {}}
                  transition={{ delay: i * 0.1, duration: 0.5 }}>🌸</motion.span>
              ))}
            </div>

            <motion.button
              className="btn-purple w-full py-4 text-xl font-black rounded-2xl relative overflow-hidden"
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            >
              <span className="relative z-10">ابدأ مع لجين 🌸</span>
              <motion.div className="absolute inset-0 bg-white/20"
                initial={{ x: '-100%' }} whileHover={{ x: '100%' }} transition={{ duration: 0.5 }} />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      <motion.div className="mt-10 text-center z-10"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
        <p className="text-white/30 text-sm">✦ رحلة إيمانية ممتعة تنتظرك ✦</p>
      </motion.div>

      <AnimatePresence>
        {selectedCard && (
          <motion.div
            className="fixed inset-0 z-50 pointer-events-none"
            style={{
              background: selectedCard === 'noor'
                ? 'radial-gradient(ellipse at center, rgba(14,165,233,0.4) 0%, transparent 70%)'
                : 'radial-gradient(ellipse at center, rgba(124,58,237,0.4) 0%, transparent 70%)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
