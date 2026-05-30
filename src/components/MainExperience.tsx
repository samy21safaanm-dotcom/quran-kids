'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CharacterNoor from './CharacterNoor';
import CharacterLujain from './CharacterLujain';
import JuzAmmaExperience from './juz-amma/JuzAmmaExperience';
import type { Character, AgeGroup } from '@/lib/store';
import { ageGroupConfig } from '@/lib/store';

interface Props {
  character: Character;
  childName: string;
  ageGroup:  AgeGroup;
  onRestart: () => void;
}

const featuresYoung = [
  { icon: '🎮', title: 'ألعاب ممتعة',      desc: 'العب وتعلم معًا',                color: 'from-red-500/20 to-orange-500/20',   border: 'border-red-400/30'    },
  { icon: '📖', title: 'قصص القرآن',       desc: 'قصص الأنبياء بطريقة ممتعة',      color: 'from-blue-500/20 to-cyan-500/20',    border: 'border-blue-400/30'   },
  { icon: '🎵', title: 'أناشيد إسلامية',   desc: 'أغاني وأناشيد جميلة',            color: 'from-green-500/20 to-teal-500/20',   border: 'border-green-400/30'  },
  { icon: '⭐', title: 'جمع النجوم',        desc: 'اجمع نجومك وافوز بجوائز',        color: 'from-yellow-500/20 to-amber-500/20', border: 'border-yellow-400/30' },
];

const featuresMid = [
  { icon: '🗺️', title: 'مغامرات القرآن',   desc: 'استكشف عالم القرآن الكريم',      color: 'from-teal-500/20 to-cyan-500/20',    border: 'border-teal-400/30'   },
  { icon: '🏆', title: 'تحديات يومية',      desc: 'تحديات وألغاز إسلامية',          color: 'from-blue-500/20 to-indigo-500/20',  border: 'border-blue-400/30'   },
  { icon: '📚', title: 'حفظ القرآن',        desc: 'تعلم وحفظ الآيات الكريمة',       color: 'from-green-500/20 to-emerald-500/20',border: 'border-green-400/30'  },
  { icon: '🎯', title: 'نقاط ومكافآت',      desc: 'اكسب نقاطًا وارتقِ للمستويات',  color: 'from-purple-500/20 to-violet-500/20',border: 'border-purple-400/30' },
];

const featuresTeen = [
  { icon: '🤖', title: 'مساعد ذكي',         desc: 'اسأل عن أي شيء في الإسلام',     color: 'from-violet-500/20 to-purple-500/20',border: 'border-violet-400/30' },
  { icon: '📖', title: 'تفسير القرآن',       desc: 'تفسير الآيات بأسلوب عصري',      color: 'from-blue-500/20 to-sky-500/20',     border: 'border-blue-400/30'   },
  { icon: '🎓', title: 'تعلم متقدم',         desc: 'دروس متعمقة في العلوم الإسلامية',color: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-400/30'},
  { icon: '🏅', title: 'شهادات إنجاز',       desc: 'احصل على شهادات تقدير',          color: 'from-amber-500/20 to-yellow-500/20', border: 'border-amber-400/30'  },
];

const quranVerses = [
  { arabic: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ',  surah: 'سورة العلق - آية ١'   },
  { arabic: 'وَعَلَّمَ آدَمَ الْأَسْمَاءَ كُلَّهَا',    surah: 'سورة البقرة - آية ٣١' },
  { arabic: 'رَبِّ زِدْنِي عِلْمًا',                    surah: 'سورة طه - آية ١١٤'    },
];

export default function MainExperience({ character, childName, ageGroup, onRestart }: Props) {
  const [activeTab,   setActiveTab]   = useState<'home' | 'quran' | 'games' | 'profile'>('home');
  const [showJuzAmma, setShowJuzAmma] = useState(false);
  const [verseIndex]                  = useState(Math.floor(Math.random() * quranVerses.length));

  const isNoor   = character === 'noor';
  const config   = ageGroup ? ageGroupConfig[ageGroup] : ageGroupConfig['7-10'];
  const features = ageGroup === '4-6' ? featuresYoung : ageGroup === '11-14' ? featuresTeen : featuresMid;

  const themeColors = {
    '4-6':   { primary: '#FF6B6B', secondary: '#FFE66D', gradient: 'from-red-900/30 to-yellow-900/20'    },
    '7-10':  { primary: '#4ECDC4', secondary: '#45B7D1', gradient: 'from-teal-900/30 to-blue-900/20'     },
    '11-14': { primary: '#7C3AED', secondary: '#0EA5E9', gradient: 'from-purple-900/30 to-blue-900/20'   },
  };
  const theme = ageGroup ? themeColors[ageGroup] : themeColors['7-10'];

  const tabs = [
    { id: 'home',    icon: '🏠', label: 'الرئيسية' },
    { id: 'quran',   icon: '📖', label: 'القرآن'   },
    { id: 'games',   icon: '🎮', label: 'الألعاب'  },
    { id: 'profile', icon: '👤', label: 'ملفي'     },
  ] as const;

  return (
    <motion.div
      className="min-h-screen relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background */}
      <div className={`fixed inset-0 bg-gradient-to-br ${theme.gradient} from-[#020817]`} />
      <div className="fixed inset-0 islamic-pattern opacity-10" />

      <motion.div className="fixed top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-15"
        style={{ background: theme.primary }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 6, repeat: Infinity }} />
      <motion.div className="fixed bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-10"
        style={{ background: theme.secondary }}
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.08, 0.15, 0.08] }}
        transition={{ duration: 8, repeat: Infinity, delay: 2 }} />

      {/* Force true centering regardless of RTL */}
      <div
        className="relative z-10 px-4 pb-24"
        style={{ maxWidth: 896, marginLeft: 'auto', marginRight: 'auto' }}
      >

        {/* Header */}
        <motion.header className="flex items-center justify-between py-6" dir="rtl"
          initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center gap-3">
            <motion.div className="text-3xl"
              animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>📖</motion.div>
            <div>
              <h1 className="text-xl font-black gold-text">نور القرآن</h1>
              <p className="text-white/50 text-xs">رحلتك الإيمانية</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-white font-bold text-sm">مرحبًا، {childName}!</p>
              <p className="text-white/50 text-xs">{config.label}</p>
            </div>
            <motion.div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border ${isNoor ? 'bg-sky-500/20 border-sky-400/40' : 'bg-purple-500/20 border-purple-400/40'}`}
              whileHover={{ scale: 1.1 }}>
              {isNoor ? '👦' : '👧'}
            </motion.div>
          </div>
        </motion.header>

        {/* Main content */}
        <AnimatePresence mode="wait">

          {/* ── HOME ── */}
          {activeTab === 'home' && (
            <motion.div key="home" dir="rtl"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>

              {/* Welcome hero */}
              <motion.div className="glass-card-gold rounded-3xl p-6 mb-6 relative overflow-hidden"
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }}>
                <div className="flex items-center gap-4">
                  <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity }}>
                    {isNoor ? <CharacterNoor size={120} glowing /> : <CharacterLujain size={120} glowing />}
                  </motion.div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-black text-white mb-1">أهلاً يا {childName}! 🌟</h2>
                    <p className="text-white/70 text-sm leading-relaxed mb-3">
                      {ageGroup === '4-6' ? 'هيا نلعب ونتعلم معًا اليوم!'
                        : ageGroup === '7-10' ? 'مغامرة جديدة تنتظرك اليوم!'
                        : 'رحلة علم ومعرفة تبدأ الآن!'}
                    </p>
                    <div>
                      <div className="flex justify-between text-xs text-white/50 mb-1">
                        <span>المستوى ١</span><span>٢٥/١٠٠ نقطة</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})` }}
                          initial={{ width: 0 }} animate={{ width: '25%' }} transition={{ delay: 0.8, duration: 1 }} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-3 left-3 text-yellow-400 text-xl opacity-60">✨</div>
                <div className="absolute bottom-3 left-8 text-yellow-400 text-sm opacity-40">⭐</div>
              </motion.div>

              {/* Juz Amma entry card */}
              <motion.div
                className="relative rounded-3xl overflow-hidden mb-6 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(245,200,66,0.1))', border: '1px solid rgba(245,200,66,0.3)' }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                whileHover={{ scale: 1.02, y: -4 }} whileTap={{ scale: 0.98 }}
                onClick={() => setShowJuzAmma(true)}>
                <motion.div className="absolute inset-0 pointer-events-none"
                  animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity }}
                  style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(245,200,66,0.15) 0%, transparent 70%)' }} />
                <div className="relative z-10 p-5 flex items-center gap-4">
                  <motion.div className="text-6xl"
                    animate={{ y: [-4, 4, -4], rotate: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity }}>🌙</motion.div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-black text-xl">عالم جزء عم</h3>
                      <span className="bg-yellow-400/20 border border-yellow-400/40 text-yellow-400 text-xs px-2 py-0.5 rounded-full font-bold">جديد ✨</span>
                    </div>
                    <p className="text-white/60 text-sm mb-3">٣٧ سورة مباركة بتجربة سينمائية تفاعلية</p>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {['🌅','🌙','☀️','⭐','🌊'].map((e, i) => <span key={i} className="text-lg">{e}</span>)}
                      </div>
                      <span className="text-white/40 text-xs">استكشف السور</span>
                    </div>
                  </div>
                  <motion.div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
                    style={{ background: 'linear-gradient(135deg, #F5C842, #C9A227)' }}
                    animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>←</motion.div>
                </div>
              </motion.div>

              {/* Daily verse */}
              <motion.div className="glass-card rounded-3xl p-5 mb-6 border border-yellow-400/20"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">🌙</span>
                  <h3 className="text-white/70 text-sm font-bold">آية اليوم</h3>
                </div>
                <p className="text-white text-xl font-bold text-center leading-relaxed mb-2 font-quran">
                  ﴿ {quranVerses[verseIndex].arabic} ﴾
                </p>
                <p className="text-yellow-400/70 text-xs text-center">{quranVerses[verseIndex].surah}</p>
              </motion.div>

              {/* Features grid */}
              <h3 className="text-white/70 text-sm font-bold mb-4 flex items-center gap-2">
                <span>⚡</span> استكشف الأنشطة
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, i) => (
                  <motion.div key={feature.title}
                    className={`glass-card bg-gradient-to-br ${feature.color} border ${feature.border} rounded-2xl p-5 cursor-pointer`}
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.1 }}
                    whileHover={{ scale: 1.04, y: -4 }} whileTap={{ scale: 0.97 }}>
                    <div className="text-4xl mb-3">{feature.icon}</div>
                    <h4 className="text-white font-bold text-base mb-1">{feature.title}</h4>
                    <p className="text-white/60 text-xs leading-relaxed">{feature.desc}</p>
                    <div className="mt-3 flex items-center gap-1 text-white/40 text-xs">
                      <span>ابدأ الآن</span><span>←</span>
                    </div>
                  </motion.div>
                ))}
              </div>

            </motion.div>
          )}

          {/* ── QURAN ── */}
          {activeTab === 'quran' && (
            <motion.div key="quran" dir="rtl"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <motion.div className="rounded-2xl p-4 flex items-center gap-4 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(245,200,66,0.1))', border: '1px solid rgba(245,200,66,0.3)' }}
                whileHover={{ scale: 1.02 }} onClick={() => setShowJuzAmma(true)}>
                <div className="text-4xl">🌙</div>
                <div className="flex-1">
                  <h3 className="text-white font-black">جزء عم</h3>
                  <p className="text-white/50 text-xs">٣٧ سورة • تجربة تفاعلية</p>
                </div>
                <span className="text-yellow-400 font-bold">←</span>
              </motion.div>

              <h2 className="text-xl font-black text-white/60 mt-4">سور أخرى</h2>
              {[
                { name: 'الفاتحة', ayat: 7,   type: 'مكية' },
                { name: 'البقرة',  ayat: 286,  type: 'مدنية' },
                { name: 'آل عمران',ayat: 200,  type: 'مدنية' },
                { name: 'النساء',  ayat: 176,  type: 'مدنية' },
                { name: 'المائدة', ayat: 120,  type: 'مدنية' },
              ].map((surah, i) => (
                <motion.div key={surah.name}
                  className="glass-card rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:bg-white/10 transition-all"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02 }}>
                  <div className="w-12 h-12 rounded-full bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center font-bold text-yellow-400">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold">سورة {surah.name}</h3>
                    <p className="text-white/50 text-xs">{surah.type} • {surah.ayat} آية</p>
                  </div>
                  <span className="text-white/30 text-xl">←</span>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* ── GAMES ── */}
          {activeTab === 'games' && (
            <motion.div key="games" dir="rtl"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <h2 className="text-2xl font-black text-white mb-6">🎮 الألعاب التعليمية</h2>
              {[
                { icon: '🧩', title: 'لعبة الكلمات',      desc: 'رتب الآيات الكريمة',       points: 30 },
                { icon: '🎯', title: 'اختبار المعلومات',   desc: 'أسئلة إسلامية ممتعة',      points: 50 },
                { icon: '🗺️', title: 'رحلة الأنبياء',     desc: 'استكشف قصص الأنبياء',      points: 40 },
                { icon: '⭐', title: 'جمع النجوم',          desc: 'اجمع نجوم القرآن',          points: 20 },
              ].map((game, i) => (
                <motion.div key={game.title} className="glass-card rounded-2xl p-5 cursor-pointer"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.03, y: -3 }}>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{game.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg">{game.title}</h3>
                      <p className="text-white/60 text-sm">{game.desc}</p>
                    </div>
                    <div className="text-center">
                      <div className="text-yellow-400 font-bold">+{game.points}</div>
                      <div className="text-white/40 text-xs">نقطة</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* ── PROFILE ── */}
          {activeTab === 'profile' && (
            <motion.div key="profile" dir="rtl"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <div className="text-center py-8">
                <motion.div className="inline-block mb-4"
                  animate={{ y: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity }}>
                  {isNoor ? <CharacterNoor size={160} glowing /> : <CharacterLujain size={160} glowing />}
                </motion.div>
                <h2 className="text-3xl font-black text-white">{childName}</h2>
                <p className="text-white/50 mt-1">{config.label}</p>
                <div className="flex justify-center gap-2 mt-3">
                  {[...Array(3)].map((_, i) => <span key={i} className="text-yellow-400 text-xl">⭐</span>)}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'النقاط',     value: '٢٥', icon: '⭐' },
                  { label: 'الأيام',     value: '١',  icon: '📅' },
                  { label: 'الإنجازات', value: '٢',  icon: '🏆' },
                ].map(stat => (
                  <div key={stat.label} className="glass-card rounded-2xl p-4 text-center">
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className="text-white font-black text-xl">{stat.value}</div>
                    <div className="text-white/50 text-xs">{stat.label}</div>
                  </div>
                ))}
              </div>
              <motion.button
                className="w-full glass-card rounded-2xl p-4 text-white/60 hover:text-white hover:bg-white/10 transition-all font-medium"
                onClick={onRestart} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                🔄 البدء من جديد
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      <motion.nav className="fixed bottom-0 left-0 right-0 z-50"
        initial={{ y: 100 }} animate={{ y: 0 }} transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}>
        <div className="px-4 pb-4" style={{ maxWidth: 896, marginLeft: 'auto', marginRight: 'auto' }} dir="ltr">
          <div className="glass-card border border-white/10 rounded-2xl p-2 flex justify-around">
            {tabs.map(tab => (
              <motion.button key={tab.id}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  activeTab === tab.id ? 'bg-yellow-400/20 text-yellow-400' : 'text-white/40 hover:text-white/70'}`}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <span className="text-xl">{tab.icon}</span>
                <span className="text-xs font-medium">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div className="w-1 h-1 rounded-full bg-yellow-400" layoutId="navDot" />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Juz Amma overlay */}
      <AnimatePresence>
        {showJuzAmma && (
          <JuzAmmaExperience
            character={character}
            childName={childName}
            onBack={() => setShowJuzAmma(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
