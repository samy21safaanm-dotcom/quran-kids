'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CharacterNoor from './CharacterNoor';
import CharacterLujain from './CharacterLujain';
import type { Character, AgeGroup } from '@/lib/store';
import { ageGroupConfig } from '@/lib/store';

interface Message {
  id:   string;
  type: 'bot' | 'user';
  text: string;
}

interface Props {
  character: Character;
  onComplete: (name: string, ageGroup: AgeGroup) => void;
}

type ChatStep = 'greeting' | 'waitName' | 'waitAge' | 'done';

const ageGroups: { value: AgeGroup; label: string; emoji: string; desc: string }[] = [
  { value: '4-6',   label: '٤ - ٦ سنوات',  emoji: '🌱', desc: 'أنا صغير'  },
  { value: '7-10',  label: '٧ - ١٠ سنوات', emoji: '⚡', desc: 'أنا مغامر' },
  { value: '11-14', label: '١١ - ١٤ سنة',  emoji: '🚀', desc: 'أنا كبير'  },
];

// ── Web Audio helpers ─────────────────────────────────────────────────────────
function createAudioCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  } catch { return null; }
}
function playTone(ctx: AudioContext, freq: number, type: OscillatorType, t: number, dur: number, gain = 0.18) {
  const osc = ctx.createOscillator();
  const g   = ctx.createGain();
  osc.connect(g); g.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  osc.start(t); osc.stop(t + dur);
}
function playMessageSound(ctx: AudioContext) {
  const t = ctx.currentTime;
  playTone(ctx, 660, 'sine', t, 0.08, 0.12);
  playTone(ctx, 880, 'sine', t + 0.06, 0.10, 0.08);
}
function playUserSound(ctx: AudioContext) {
  const t = ctx.currentTime;
  playTone(ctx, 523, 'sine', t, 0.07, 0.10);
  playTone(ctx, 659, 'sine', t + 0.05, 0.07, 0.10);
  playTone(ctx, 784, 'sine', t + 0.10, 0.09, 0.12);
}
function playSuccessSound(ctx: AudioContext) {
  const t = ctx.currentTime;
  [523, 659, 784, 1047].forEach((f, i) => playTone(ctx, f, 'sine', t + i * 0.09, 0.18, 0.15));
}

export default function ChatExperience({ character, onComplete }: Props) {
  const [messages,    setMessages]    = useState<Message[]>([]);
  const [step,        setStep]        = useState<ChatStep>('greeting');
  const [inputValue,  setInputValue]  = useState('');
  const [childName,   setChildName]   = useState('');
  const [isTyping,    setIsTyping]    = useState(false);
  const [selectedAge, setSelectedAge] = useState<AgeGroup>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);
  const audioCtxRef    = useRef<AudioContext | null>(null);
  const greetingRan    = useRef(false);

  const isNoor = character === 'noor';

  const ensureAudio = useCallback(() => {
    if (!audioCtxRef.current) audioCtxRef.current = createAudioCtx();
    if (audioCtxRef.current?.state === 'suspended') audioCtxRef.current.resume();
  }, []);

  const addBotMessage = useCallback((text: string) => {
    return new Promise<void>(resolve => {
      setMessages(prev => [...prev, { id: `${Date.now()}-${Math.random()}`, type: 'bot', text }]);
      if (audioCtxRef.current) playMessageSound(audioCtxRef.current);
      setTimeout(resolve, 0);
    });
  }, []);

  const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

  const showTyping = useCallback((ms: number) => {
    setIsTyping(true);
    return wait(ms).then(() => setIsTyping(false));
  }, []);

  useEffect(() => {
    if (greetingRan.current) return;
    greetingRan.current = true;
    audioCtxRef.current = createAudioCtx();

    (async () => {
      await showTyping(1200);
      await addBotMessage('السلام عليكم يا صديقي 🌟');
      await showTyping(900);
      await addBotMessage('مرحبًا بك في عالم نور القرآن ✨');
      await showTyping(1100);
      await addBotMessage('هنا سنبدأ رحلة مليئة بالقصص والمغامرات وتعلم القرآن بطريقة ممتعة 🎉');
      await showTyping(800);
      await addBotMessage('ما اسمك يا بطل؟ 😊');
      setStep('waitName');
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (step === 'waitName' || step === 'waitAge') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [step]);

  const handleNameSubmit = async () => {
    const name = inputValue.trim();
    if (!name) return;
    ensureAudio();
    setChildName(name);
    setInputValue('');
    setMessages(prev => [...prev, { id: `${Date.now()}-u`, type: 'user', text: name }]);
    if (audioCtxRef.current) playUserSound(audioCtxRef.current);
    await showTyping(1000);
    await addBotMessage(`أهلاً وسهلاً يا ${name}! 🎉`);
    await showTyping(800);
    await addBotMessage('كم عمرك؟ 🌱');
    setStep('waitAge');
  };

  const handleAgeSelect = async (age: AgeGroup) => {
    if (!age || step !== 'waitAge') return;
    ensureAudio();
    setSelectedAge(age);
    setStep('done');
    const ageLabel = ageGroups.find(a => a.value === age)?.label ?? '';
    const currentName = childName;
    setMessages(prev => [...prev, { id: `${Date.now()}-u`, type: 'user', text: `عمري ${ageLabel}` }]);
    if (audioCtxRef.current) playUserSound(audioCtxRef.current);
    await showTyping(1000);
    await addBotMessage(`رائع يا ${currentName}! 🌟`);
    await showTyping(700);
    await addBotMessage('أعددت لك تجربة خاصة تناسب عمرك تمامًا ✨');
    await showTyping(600);
    await addBotMessage('هيا نبدأ مغامرتنا! بسم الله 🚀');
    if (audioCtxRef.current) playSuccessSound(audioCtxRef.current);
    await wait(2000);
    onComplete(currentName, age);
  };

  // suppress unused warning
  void ageGroupConfig;

  return (
    <motion.div
      className="fixed inset-0 z-40 flex"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
      onClick={ensureAudio}
    >
      <div className={`absolute inset-0 ${isNoor
        ? 'bg-gradient-to-br from-[#020817] via-[#0A1628] to-[#0F2040]'
        : 'bg-gradient-to-br from-[#020817] via-[#1a0a2e] to-[#2d1b4e]'}`} />
      <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 ${isNoor ? 'bg-sky-500' : 'bg-purple-500'}`} />
      <div className={`absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-15 ${isNoor ? 'bg-yellow-400' : 'bg-pink-500'}`} />
      <div className="absolute inset-0 islamic-pattern opacity-10" />

      <div className="relative z-10 flex flex-col md:flex-row w-full max-w-5xl mx-auto p-4 gap-4">

        {/* Character sidebar */}
        <motion.div
          className="hidden md:flex flex-col items-center justify-end pb-8 w-64 flex-shrink-0"
          initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
        >
          <motion.div animate={{ y: [-8, 8, -8] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
            {isNoor ? <CharacterNoor size={220} glowing /> : <CharacterLujain size={220} glowing />}
          </motion.div>
          <motion.div
            className={`mt-2 px-6 py-2 rounded-full font-bold text-lg ${isNoor
              ? 'bg-sky-500/20 border border-sky-400/40 text-sky-300'
              : 'bg-purple-500/20 border border-purple-400/40 text-purple-300'}`}
            animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}
          >
            {isNoor ? '🌟 نور' : '🌸 لجين'}
          </motion.div>
        </motion.div>

        {/* Chat panel */}
        <motion.div
          className="flex-1 flex flex-col chat-container rounded-3xl overflow-hidden border border-white/10"
          initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}
        >
          {/* Header */}
          <div className={`px-6 py-4 border-b border-white/10 flex items-center gap-3 ${isNoor
            ? 'bg-gradient-to-r from-sky-900/40 to-transparent'
            : 'bg-gradient-to-r from-purple-900/40 to-transparent'}`}>
            <div className="text-2xl">{isNoor ? '🌟' : '🌸'}</div>
            <div>
              <h3 className="font-bold text-white text-lg">{isNoor ? 'نور' : 'لجين'}</h3>
              <p className={`text-xs ${isNoor ? 'text-sky-400' : 'text-purple-400'}`}>مرشدك في رحلة القرآن ✨</p>
            </div>
            <div className="mr-auto flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs">متصل</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 min-h-0" style={{ maxHeight: 'calc(100vh - 280px)' }}>
            <AnimatePresence initial={false}>
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  initial={{ opacity: 0, y: 18, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0,  scale: 1    }}
                  transition={{ duration: 0.35, type: 'spring', stiffness: 220 }}
                >
                  {msg.type === 'bot' ? (
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg ${isNoor
                      ? 'bg-sky-500/20 border border-sky-400/30'
                      : 'bg-purple-500/20 border border-purple-400/30'}`}>
                      {isNoor ? '🌟' : '🌸'}
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg bg-yellow-500/20 border border-yellow-400/30">
                      😊
                    </div>
                  )}
                  <div className={`max-w-xs md:max-w-sm lg:max-w-md px-5 py-3 rounded-2xl ${msg.type === 'bot' ? 'message-bot' : 'message-user'}`}>
                    <p className="text-white font-medium leading-relaxed text-base md:text-lg">{msg.text}</p>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div key="typing" className="flex gap-3"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${isNoor
                    ? 'bg-sky-500/20 border border-sky-400/30'
                    : 'bg-purple-500/20 border border-purple-400/30'}`}>
                    {isNoor ? '🌟' : '🌸'}
                  </div>
                  <div className="message-bot px-5 py-4 rounded-2xl flex items-center gap-2">
                    <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="p-4 border-t border-white/10">
            <AnimatePresence mode="wait">
              {step === 'waitName' && (
                <motion.div key="name-input" className="flex gap-3"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleNameSubmit()}
                    placeholder="اكتب اسمك هنا..."
                    className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-5 py-3 text-white placeholder-white/40 text-lg font-medium focus:outline-none focus:border-yellow-400/60 focus:bg-white/15 transition-all"
                    dir="rtl"
                    maxLength={30}
                  />
                  <motion.button
                    onClick={handleNameSubmit}
                    disabled={!inputValue.trim()}
                    className={`px-6 py-3 rounded-2xl font-bold text-lg transition-all ${inputValue.trim() ? 'btn-gold' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
                    whileHover={inputValue.trim() ? { scale: 1.05 } : {}}
                    whileTap={inputValue.trim()   ? { scale: 0.95 } : {}}
                  >✓</motion.button>
                </motion.div>
              )}

              {step === 'waitAge' && (
                <motion.div key="age-input" className="grid grid-cols-3 gap-3"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  {ageGroups.map((age, i) => (
                    <motion.button
                      key={age.value}
                      className={`age-card p-4 text-center ${selectedAge === age.value ? 'selected' : ''}`}
                      onClick={() => handleAgeSelect(age.value)}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    >
                      <div className="text-3xl mb-2">{age.emoji}</div>
                      <div className="text-white font-bold text-sm">{age.label}</div>
                      <div className="text-white/50 text-xs mt-1">{age.desc}</div>
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {(step === 'greeting' || step === 'done') && (
                <motion.div key="waiting" className="flex justify-center"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex gap-2 items-center text-white/40 text-sm">
                    <div className="w-2 h-2 rounded-full bg-yellow-400/60 animate-pulse" />
                    <span>جاري التحضير لمغامرتك...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
