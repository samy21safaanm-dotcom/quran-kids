'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CharacterNoor from './CharacterNoor';
import CharacterLujain from './CharacterLujain';
import JuzAmmaExperience from './juz-amma/JuzAmmaExperience';
import type { Character, AgeGroup } from '@/lib/store';
import { ageGroupConfig } from '@/lib/store';
import { JUZ_AMMA } from '@/lib/juzAmmaData';

interface Props {
  character: Character;
  childName: string;
  ageGroup:  AgeGroup;
  onRestart: () => void;
}

interface FeatureItem {
  id: string;
  icon: string;
  title: string;
  desc: string;
  color: string;
  border: string;
}

interface ProphetStory {
  prophet: string;
  title: string;
  summary: string;
  lesson: string;
  action: string;
  icon: string;
  place: string;
  period: string;
  keyFacts: string[];
  challengeQuestion: string;
  challengeOptions: string[];
  challengeCorrectIndex: number;
}

const featuresYoung: FeatureItem[] = [
  { id: 'stories',        icon: '📖', title: 'قصص القرآن',       desc: 'قصص الأنبياء بطريقة ممتعة',              color: 'from-blue-500/20 to-cyan-500/20',    border: 'border-blue-400/30'   },
  { id: 'dailyChallenge', icon: '🏆', title: 'تحدي اليوم',       desc: 'تحدي قرآني قصير كل يوم',                  color: 'from-red-500/20 to-orange-500/20',   border: 'border-red-400/30'    },
  { id: 'ayahMeaning',    icon: '💡', title: 'معنى آية اليوم',   desc: 'شرح مبسط يساعد الطفل على الفهم',          color: 'from-green-500/20 to-teal-500/20',   border: 'border-green-400/30'  },
  { id: 'juzProgress',    icon: '⭐', title: 'إنجازي في جزء عم', desc: 'تابع تقدمك في السور والتحديات',           color: 'from-yellow-500/20 to-amber-500/20', border: 'border-yellow-400/30' },
];

const featuresMid: FeatureItem[] = [
  { id: 'stories',        icon: '🗺️', title: 'مغامرات القرآن',   desc: 'استكشف عالم القرآن الكريم',              color: 'from-teal-500/20 to-cyan-500/20',    border: 'border-teal-400/30'   },
  { id: 'dailyChallenge', icon: '🏆', title: 'تحدي اليوم',       desc: 'تحدي يومي من جزء عم',                     color: 'from-blue-500/20 to-indigo-500/20',  border: 'border-blue-400/30'   },
  { id: 'ayahMeaning',    icon: '📚', title: 'معنى آية اليوم',   desc: 'فهم مبسط للآيات الكريمة',                color: 'from-green-500/20 to-emerald-500/20',border: 'border-green-400/30'  },
  { id: 'juzProgress',    icon: '🎯', title: 'إنجازي في جزء عم', desc: 'تقدمك ونقاطك في الحفظ',                  color: 'from-purple-500/20 to-violet-500/20',border: 'border-purple-400/30' },
];

const featuresTeen: FeatureItem[] = [
  { id: 'stories',        icon: '🤖', title: 'قصص وتدبر',         desc: 'تعلم من قصص القرآن والدروس المستفادة',   color: 'from-violet-500/20 to-purple-500/20',border: 'border-violet-400/30' },
  { id: 'dailyChallenge', icon: '📖', title: 'تحدي اليوم',       desc: 'تحدي يومي لتثبيت الحفظ',                 color: 'from-blue-500/20 to-sky-500/20',     border: 'border-blue-400/30'   },
  { id: 'ayahMeaning',    icon: '🎓', title: 'معنى آية اليوم',   desc: 'تفسير مبسط بأسلوب مناسب للعمر',          color: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-400/30'},
  { id: 'juzProgress',    icon: '🏅', title: 'إنجازي في جزء عم', desc: 'متابعة الإنجاز والتقدم الشخصي',          color: 'from-amber-500/20 to-yellow-500/20', border: 'border-amber-400/30'  },
];

const quranVerses = [
  {
    arabic: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ',
    surah: 'سورة العلق - آية ١',
    meaning: 'الله يأمرنا أن نبدأ العلم بذكره، فالعلم عبادة ونور.',
    story: 'كان طفل يبدأ واجباته بالبسملة، فصار قلبه هادئًا وتركيزه أفضل كل يوم.',
    todayAction: 'قبل أي درس اليوم، قل: بسم الله، ثم ابدأ بثقة وهدوء.',
  },
  {
    arabic: 'وَعَلَّمَ آدَمَ الْأَسْمَاءَ كُلَّهَا',
    surah: 'سورة البقرة - آية ٣١',
    meaning: 'من فضل الله أنه علّم الإنسان ورفعه بالعلم والمعرفة.',
    story: 'عندما يتعلم الطفل كلمة جديدة يوميًا، يكبر عقله ويصبح أكثر فهمًا لما حوله.',
    todayAction: 'تعلم كلمة مفيدة جديدة اليوم، وعلّمها لشخص تحبه.',
  },
  {
    arabic: 'رَبِّ زِدْنِي عِلْمًا',
    surah: 'سورة طه - آية ١١٤',
    meaning: 'دعاء جميل نطلب فيه من الله زيادة العلم النافع.',
    story: 'طفل كان يردد هذا الدعاء قبل الدراسة، فصار يحب التعلم ولا يخاف من الأخطاء.',
    todayAction: 'ردد الدعاء 3 مرات قبل المذاكرة، ثم ابدأ بخطوة صغيرة.',
  },
];

const prophetStories: ProphetStory[] = [
  {
    prophet: 'نوح عليه السلام',
    title: 'سفينة النجاة',
    summary: 'ظل نبي الله نوح يدعو قومه بصبر طويل إلى عبادة الله وحده.',
    lesson: 'الصبر على الحق طريق الفوز، حتى لو طال الطريق.',
    action: 'اليوم: اصبر على عمل خير واحد حتى تكمله للنهاية.',
    icon: '🛶',
    place: 'العراق وما حولها',
    period: 'من أوائل الأنبياء بعد آدم',
    keyFacts: [
      'دعا قومه ليلًا ونهارًا سنين طويلة.',
      'صنع السفينة بأمر الله رغم سخرية قومه.',
      'نجّى الله المؤمنين وجعل القصة عبرة للعالمين.',
    ],
    challengeQuestion: 'ما الصفة الأبرز في قصة نوح عليه السلام؟',
    challengeOptions: ['الصبر في الدعوة', 'حب المال', 'السرعة في الغضب'],
    challengeCorrectIndex: 0,
  },
  {
    prophet: 'إبراهيم عليه السلام',
    title: 'قوة التوحيد',
    summary: 'واجه نبي الله إبراهيم قومه بالحكمة، وبيّن لهم أن الله هو الخالق وحده.',
    lesson: 'المؤمن الشجاع يتمسك بالحق بلطف وحكمة.',
    action: 'اليوم: قل لا إله إلا الله 10 مرات بقلب حاضر.',
    icon: '🔥',
    place: 'العراق ثم الشام ومكة',
    period: 'أبو الأنبياء',
    keyFacts: [
      'حطّم الأصنام ليبين بطلان عبادتها.',
      'أُلقي في النار فكانت عليه بردًا وسلامًا.',
      'رفع قواعد الكعبة مع ابنه إسماعيل عليهما السلام.',
    ],
    challengeQuestion: 'ماذا نتعلم من موقف إبراهيم مع قومه؟',
    challengeOptions: ['الشجاعة مع الحكمة', 'الخوف من قول الحق', 'ترك العبادة'],
    challengeCorrectIndex: 0,
  },
  {
    prophet: 'موسى عليه السلام',
    title: 'الثقة بالله',
    summary: 'عند البحر قال موسى بثقة: كلا إن معي ربي سيهدين.',
    lesson: 'مع التوكل على الله يأتي الفرج في أصعب اللحظات.',
    action: 'اليوم: عند أي خوف، قل: حسبي الله ونعم الوكيل.',
    icon: '🌊',
    place: 'مصر ثم سيناء',
    period: 'زمن فرعون وبني إسرائيل',
    keyFacts: [
      'أنقذه الله وهو رضيع وجعله نبيًا كريمًا.',
      'أرسله الله إلى فرعون بآيات عظيمة.',
      'شق الله له البحر فنجا هو والمؤمنون.',
    ],
    challengeQuestion: 'عند الشدة ماذا قال موسى عليه السلام؟',
    challengeOptions: ['لا أستطيع', 'كلا إن معي ربي سيهدين', 'سأرجع للوراء'],
    challengeCorrectIndex: 1,
  },
  {
    prophet: 'يوسف عليه السلام',
    title: 'العفو الجميل',
    summary: 'بعد الشدة والابتلاء، عفا يوسف عن إخوته بكلمة رحيمة.',
    lesson: 'القلب الكريم يعفو ويصلح ولا ينتقم.',
    action: 'اليوم: سامح شخصًا أخطأ معك وادعُ له بالخير.',
    icon: '🌟',
    place: 'فلسطين ثم مصر',
    period: 'من ذرية إبراهيم عليه السلام',
    keyFacts: [
      'ابتُلي صغيرًا ثم صار عزيز مصر.',
      'فسّر رؤيا الملك وأنقذ الناس من المجاعة.',
      'جمع الله له شمل أسرته بعد سنوات من الفراق.',
    ],
    challengeQuestion: 'ما الخلق الجميل الذي ظهر في قصة يوسف؟',
    challengeOptions: ['العفو عند المقدرة', 'الانتقام', 'الكذب'],
    challengeCorrectIndex: 0,
  },
  {
    prophet: 'يونس عليه السلام',
    title: 'دعاء الفرج',
    summary: 'في الظلمات دعا يونس ربه فاستجاب الله له ونجّاه.',
    lesson: 'الدعاء الصادق يفتح أبواب الرحمة.',
    action: 'اليوم: ردّد دعاء يونس 7 مرات بهدوء.',
    icon: '🐋',
    place: 'نينوى (العراق)',
    period: 'قبل عيسى عليه السلام بقرون',
    keyFacts: [
      'خرج من قومه مغاضبًا ثم ابتلاه الله ليعلمه الصبر.',
      'ابتلعه الحوت ولم يضره بأمر الله.',
      'عاد إلى قومه فآمنوا جميعًا.',
    ],
    challengeQuestion: 'ما مفتاح الفرج في قصة يونس عليه السلام؟',
    challengeOptions: ['الدعاء الصادق', 'اليأس', 'ترك التوبة'],
    challengeCorrectIndex: 0,
  },
  {
    prophet: 'محمد صلى الله عليه وسلم',
    title: 'الرحمة والخلق العظيم',
    summary: 'كان النبي رحيمًا بالأطفال والناس جميعًا، قدوة في الأخلاق.',
    lesson: 'الابتسامة والكلمة الطيبة عبادة عظيمة.',
    action: 'اليوم: ابتسم لوالديك وقل كلمة طيبة لثلاثة أشخاص.',
    icon: '🕊️',
    place: 'مكة المكرمة ثم المدينة المنورة',
    period: 'خاتم الأنبياء',
    keyFacts: [
      'أُرسل رحمة للعالمين وهدى للبشرية.',
      'علّم الناس القرآن والأخلاق والعدل.',
      'ترك أمةً على المحجة البيضاء.',
    ],
    challengeQuestion: 'ما السلوك الذي يحبه النبي صلى الله عليه وسلم؟',
    challengeOptions: ['الرحمة واللطف', 'القسوة', 'إيذاء الناس'],
    challengeCorrectIndex: 0,
  },
];

export default function MainExperience({ character, childName, ageGroup, onRestart }: Props) {
  const [activeTab,   setActiveTab]   = useState<'home' | 'quran' | 'games' | 'profile'>('home');
  const [showJuzAmma, setShowJuzAmma] = useState(false);
  const [verseIndex]                  = useState(Math.floor(Math.random() * quranVerses.length));
  const [showAyahMeaning, setShowAyahMeaning] = useState(false);
  const [showAyahCelebrate, setShowAyahCelebrate] = useState(false);
  const [showProphetStories, setShowProphetStories] = useState(false);
  const [prophetStoryIndex, setProphetStoryIndex] = useState(0);
  const [isStorySpeaking, setIsStorySpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [storySelectedOption, setStorySelectedOption] = useState<number | null>(null);
  const [showStoryCelebrate, setShowStoryCelebrate] = useState(false);

  const isNoor   = character === 'noor';
  const config   = ageGroup ? ageGroupConfig[ageGroup] : ageGroupConfig['7-10'];
  const features = ageGroup === '4-6' ? featuresYoung : ageGroup === '11-14' ? featuresTeen : featuresMid;
  const completedSurahs = JUZ_AMMA.filter((s) => s.progress === 100).length;
  const startedSurahs = JUZ_AMMA.filter((s) => s.progress > 0).length;
  const dailySurah = JUZ_AMMA[new Date().getDate() % JUZ_AMMA.length];

  const getFeatureDesc = (feature: FeatureItem) => {
    if (feature.id === 'dailyChallenge') {
      return `ابدأ اليوم مع سورة ${dailySurah.name}`;
    }
    if (feature.id === 'juzProgress') {
      return `${completedSurahs} مكتملة • ${startedSurahs} بدأتها`;
    }
    return feature.desc;
  };

  const getFeatureActionLabel = (feature: FeatureItem) => {
    if (feature.id === 'dailyChallenge') return 'ابدأ التحدي';
    if (feature.id === 'ayahMeaning') return 'اقرأ المعنى';
    if (feature.id === 'juzProgress') return 'تابع إنجازك';
    return 'استكشف الآن';
  };

  const handleFeatureClick = (feature: FeatureItem) => {
    if (feature.id === 'dailyChallenge') {
      window.location.href = `/challenge/${dailySurah.id}`;
      return;
    }
    if (feature.id === 'ayahMeaning') {
      setShowAyahMeaning(true);
      return;
    }
    if (feature.id === 'juzProgress') {
      setShowJuzAmma(true);
      return;
    }
    if (feature.id === 'stories') {
      setProphetStoryIndex(0);
      setShowProphetStories(true);
      return;
    }
  };

  const handleAyahComplete = () => {
    const audio = new Audio('/audios/clap.mp3');
    audio.play().catch(() => {
      // تجاهل أخطاء التشغيل التلقائي في بعض المتصفحات
    });

    setShowAyahCelebrate(true);
    setTimeout(() => {
      setShowAyahCelebrate(false);
      setShowAyahMeaning(false);
    }, 1200);
  };

  const currentStory = prophetStories[prophetStoryIndex];

  const selectBestArabicVoice = (voices: SpeechSynthesisVoice[]) => {
    const arabicVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith('ar'));
    if (!arabicVoices.length) return null;

    const preferredNameSnippets = [
      'hoda',
      'naayf',
      'maged',
      'google العربية',
      'arabic',
    ];

    for (const snippet of preferredNameSnippets) {
      const found = arabicVoices.find((voice) => voice.name.toLowerCase().includes(snippet));
      if (found) return found;
    }

    const saudi = arabicVoices.find((voice) => voice.lang.toLowerCase() === 'ar-sa');
    return saudi || arabicVoices[0];
  };

  const stopStoryNarration = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsStorySpeaking(false);
  };

  const speakCurrentStory = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isStorySpeaking) {
      stopStoryNarration();
      return;
    }

    const text = [
      `${currentStory.prophet}.`,
      `${currentStory.title}.`,
      currentStory.summary,
      `معلومة: المكان ${currentStory.place}.`,
      `معلومة: الفترة ${currentStory.period}.`,
      `أهم النقاط: ${currentStory.keyFacts.join(' . ')}`,
      `الدرس المستفاد: ${currentStory.lesson}`,
      `تطبيق اليوم: ${currentStory.action}`,
    ].join(' ');

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.88;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const bestVoice = selectBestArabicVoice(voices);
    if (bestVoice) {
      utterance.voice = bestVoice;
      utterance.lang = bestVoice.lang;
    }

    utterance.onend = () => setIsStorySpeaking(false);
    utterance.onerror = () => setIsStorySpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsStorySpeaking(true);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSupported(true);
      window.speechSynthesis.getVoices();
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (!showProphetStories) stopStoryNarration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showProphetStories]);

  const goToNextStory = () => {
    stopStoryNarration();
    setStorySelectedOption(null);
    setProphetStoryIndex((prev) => (prev + 1) % prophetStories.length);
  };
  const goToPrevStory = () => {
    stopStoryNarration();
    setStorySelectedOption(null);
    setProphetStoryIndex((prev) => (prev - 1 + prophetStories.length) % prophetStories.length);
  };

  const handleStoryAnswer = (optionIndex: number) => {
    setStorySelectedOption(optionIndex);
    if (optionIndex === currentStory.challengeCorrectIndex) {
      const audio = new Audio('/audios/clap.mp3');
      audio.play().catch(() => {
        // تجاهل أخطاء التشغيل التلقائي
      });
      setShowStoryCelebrate(true);
      setTimeout(() => setShowStoryCelebrate(false), 900);
    }
  };

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
      style={{
        paddingLeft: 'max(16px, env(safe-area-inset-left))',
        paddingRight: 'max(16px, env(safe-area-inset-right))',
        boxSizing: 'border-box',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {!showJuzAmma && (
        <>
      {/* Background */}
      <div className={`fixed inset-0 bg-gradient-to-br ${theme.gradient} from-[#020817]`} />
      <div className="fixed inset-0 islamic-pattern opacity-10" />

      <motion.div className="fixed top-0 right-0 w-[min(70vw,24rem)] h-[min(70vw,24rem)] rounded-full blur-3xl opacity-15"
        style={{ background: theme.primary }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 6, repeat: Infinity }} />
      <motion.div className="fixed bottom-0 left-0 w-[min(52vw,16rem)] h-[min(52vw,16rem)] rounded-full blur-3xl opacity-10"
        style={{ background: theme.secondary }}
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.08, 0.15, 0.08] }}
        transition={{ duration: 8, repeat: Infinity, delay: 2 }} />

      {/* Force true centering regardless of RTL */}
      <div
        className="relative z-10 px-3 sm:px-4 pb-24"
        style={{ maxWidth: 896, marginLeft: 'auto', marginRight: 'auto', minWidth: 0 }}
      >

        {/* Header */}
        <motion.header className="flex items-center justify-between gap-2 sm:gap-3 py-4 sm:py-6" dir="rtl"
          initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center gap-3">
            <motion.div className="text-3xl"
              animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>📖</motion.div>
            <div>
              <h1 className="text-lg sm:text-xl font-black gold-text">نبأ</h1>
              <p className="text-white/50 text-xs">رحلتك الإيمانية</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="text-right min-w-0">
              <p className="text-white font-bold text-xs sm:text-sm truncate">مرحبًا، {childName}!</p>
              <p className="text-white/50 text-xs">{config.label}</p>
            </div>
            <motion.div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-base sm:text-lg border flex-shrink-0 ${isNoor ? 'bg-sky-500/20 border-sky-400/40' : 'bg-purple-500/20 border-purple-400/40'}`}
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
              <motion.div className="glass-card-gold rounded-3xl p-4 sm:p-6 mb-6 relative overflow-hidden"
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }}>
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-right">
                  <motion.div className="scale-90 sm:scale-100 origin-center" animate={{ y: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity }}>
                    {isNoor ? <CharacterNoor size={120} glowing /> : <CharacterLujain size={120} glowing />}
                  </motion.div>
                  <div className="flex-1 w-full min-w-0">
                    <h2 className="text-[clamp(1.25rem,4.8vw,1.5rem)] font-black text-white mb-1 break-words">أهلاً يا {childName}! 🌟</h2>
                    <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-3">
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
                className="relative rounded-3xl overflow-hidden mb-7 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(245,200,66,0.1))', border: '1px solid rgba(245,200,66,0.3)' }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                whileHover={{ scale: 1.02, y: -4 }} whileTap={{ scale: 0.98 }}
                onClick={() => setShowJuzAmma(true)}>
                <motion.div className="absolute inset-0 pointer-events-none"
                  animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity }}
                  style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(245,200,66,0.15) 0%, transparent 70%)' }} />
                <div className="relative z-10 p-4 sm:p-6 md:p-8 min-h-[150px] sm:min-h-[180px] flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-5 text-center sm:text-right">
                  <motion.div className="text-5xl sm:text-7xl md:text-8xl"
                    animate={{ y: [-4, 4, -4], rotate: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity }}>🌙</motion.div>
                  <div className="flex-1 w-full min-w-0">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                      <h3 className="text-white font-black text-xl sm:text-2xl md:text-3xl">عالم جزء عم</h3>
                      <span className="bg-yellow-400/20 border border-yellow-400/40 text-yellow-400 text-xs sm:text-sm px-3 py-1 rounded-full font-bold">جديد ✨</span>
                    </div>
                    <p className="text-white/70 text-sm sm:text-base md:text-lg mb-3 sm:mb-4">٣٧ سورة مباركة بتجربة سينمائية تفاعلية</p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4">
                      <div className="flex gap-1 justify-center">
                        {['🌅','🌙','☀️','⭐','🌊'].map((e, i) => <span key={i} className="text-xl md:text-2xl">{e}</span>)}
                      </div>
                      <span className="text-white/50 text-xs sm:text-sm md:text-base">استكشف السور</span>
                    </div>
                  </div>
                  <motion.div className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl md:text-3xl font-bold shrink-0"
                    style={{ background: 'linear-gradient(135deg, #F5C842, #C9A227)' }}
                    animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>←</motion.div>
                </div>
              </motion.div>

              {/* Daily verse */}
              <motion.div className="glass-card rounded-3xl p-4 sm:p-5 mb-6 border border-yellow-400/20"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {features.map((feature, i) => (
                  <motion.div key={feature.title}
                    className={`glass-card bg-gradient-to-br ${feature.color} border ${feature.border} rounded-2xl p-5 cursor-pointer relative overflow-hidden`}
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.1 }}
                    whileHover={{ scale: 1.04, y: -4 }} whileTap={{ scale: 0.97 }}
                    onClick={() => handleFeatureClick(feature)}>
                    <motion.div
                      className="absolute -top-10 -left-10 w-24 h-24 rounded-full blur-2xl pointer-events-none"
                      style={{ background: 'rgba(245,200,66,0.16)' }}
                      animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.55, 0.3] }}
                      transition={{ duration: 3 + i, repeat: Infinity }}
                    />
                    <div className="absolute top-3 left-3 text-white/35 text-[11px] font-bold px-2 py-1 rounded-full border border-white/15 bg-black/10">
                      جديد
                    </div>
                    <div className="text-3xl sm:text-4xl mb-3">{feature.icon}</div>
                    <h4 className="text-white font-bold text-base mb-1">{feature.title}</h4>
                    <p className="text-white/60 text-xs leading-relaxed">{getFeatureDesc(feature)}</p>
                    <div className="mt-3 flex items-center gap-1 text-yellow-300/85 text-xs font-bold">
                      <span>{getFeatureActionLabel(feature)}</span><span>←</span>
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
              <h2 className="text-xl sm:text-2xl font-black text-white mb-6">🎮 الألعاب التعليمية</h2>
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
                <h2 className="text-2xl sm:text-3xl font-black text-white break-words">{childName}</h2>
                <p className="text-white/50 mt-1">{config.label}</p>
                <div className="flex justify-center gap-2 mt-3">
                  {[...Array(3)].map((_, i) => <span key={i} className="text-yellow-400 text-xl">⭐</span>)}
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
        <div
          className="px-2 sm:px-4 pb-[max(12px,env(safe-area-inset-bottom))]"
          style={{
            maxWidth: 896,
            marginLeft: 'auto',
            marginRight: 'auto',
            paddingLeft: 'max(8px, env(safe-area-inset-left))',
            paddingRight: 'max(8px, env(safe-area-inset-right))',
            boxSizing: 'border-box',
          }}
          dir="ltr"
        >
          <div className="glass-card border border-white/10 rounded-2xl p-2 flex justify-around">
            {tabs.map(tab => (
              <motion.button key={tab.id}
                className={`flex flex-col items-center gap-1 px-2 sm:px-4 py-2 rounded-xl transition-all min-h-11 ${
                  activeTab === tab.id ? 'bg-yellow-400/20 text-yellow-400' : 'text-white/40 hover:text-white/70'}`}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <span className="text-lg sm:text-xl">{tab.icon}</span>
                <span className="text-xs font-medium">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div className="w-1 h-1 rounded-full bg-yellow-400" layoutId="navDot" />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.nav>
        </>
      )}

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

      <AnimatePresence>
        {showAyahMeaning && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.button
              type="button"
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              aria-label="إغلاق نافذة معنى آية اليوم"
              onClick={() => setShowAyahMeaning(false)}
            />
            <motion.div
              className="relative w-full max-w-xl rounded-3xl border border-yellow-300/30 p-4 sm:p-6 md:p-7 max-h-[90vh] overflow-y-auto"
              style={{ background: 'linear-gradient(160deg, rgba(18,20,45,0.95), rgba(56,22,93,0.95))' }}
              initial={{ scale: 0.9, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 10, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            >
              <div className="absolute -top-3 right-6 text-2xl">💡</div>
              <div className="absolute -bottom-2 left-8 text-xl opacity-80">✨</div>

              <div className="flex items-center justify-between mb-4" dir="rtl">
                <h3 className="text-white font-black text-xl">معنى آية اليوم</h3>
                <button
                  type="button"
                  onClick={() => setShowAyahMeaning(false)}
                  className="w-9 h-9 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                  aria-label="إغلاق"
                >
                  ✕
                </button>
              </div>

              <div className="rounded-2xl border border-yellow-400/25 bg-white/5 p-4 mb-4" dir="rtl">
                <p className="text-white text-2xl leading-relaxed font-quran text-center mb-3">
                  ﴿ {quranVerses[verseIndex].arabic} ﴾
                </p>
                <p className="text-yellow-300/80 text-sm text-center">{quranVerses[verseIndex].surah}</p>
              </div>

              <div className="rounded-2xl bg-yellow-400/10 border border-yellow-300/20 p-4" dir="rtl">
                <p className="text-white/90 text-base leading-8">{quranVerses[verseIndex].meaning}</p>
              </div>

              <div className="rounded-2xl bg-cyan-400/10 border border-cyan-300/20 p-4 mt-4" dir="rtl">
                <p className="text-cyan-200 text-sm font-bold mb-1">حكاية سريعة</p>
                <p className="text-white/85 text-sm leading-7">{quranVerses[verseIndex].story}</p>
              </div>

              <div className="rounded-2xl bg-emerald-400/10 border border-emerald-300/20 p-4 mt-4" dir="rtl">
                <p className="text-emerald-200 text-sm font-bold mb-1">تطبيق اليوم</p>
                <p className="text-white/85 text-sm leading-7">{quranVerses[verseIndex].todayAction}</p>
              </div>

              <div className="mt-5 flex justify-end" dir="rtl">
                <button
                  type="button"
                  onClick={handleAyahComplete}
                  className="px-5 py-2 rounded-xl font-bold text-purple-900 bg-yellow-300 hover:bg-yellow-200 transition min-h-11"
                >
                  جميل! سأطبقها 🌟
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAyahCelebrate && (
          <motion.div
            className="fixed inset-0 z-[75] pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative w-full h-full">
              {Array.from({ length: 18 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  style={{
                    right: `${15 + (i % 6) * 12}%`,
                    top: `${30 + Math.floor(i / 6) * 12}%`,
                  }}
                  initial={{ opacity: 0, y: 10, scale: 0.6 }}
                  animate={{ opacity: [0, 1, 0], y: -50, scale: [0.6, 1.1, 0.8], rotate: [0, 20, -20, 0] }}
                  transition={{ duration: 1, delay: i * 0.03 }}
                >
                  ⭐
                </motion.div>
              ))}
            </div>
            <motion.div
              className="absolute px-6 py-3 rounded-2xl bg-yellow-300 text-purple-900 font-black text-lg shadow-2xl"
              initial={{ scale: 0.8, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: -8, opacity: 0 }}
            >
              أحسنت يا بطل! ✨
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProphetStories && (
          <motion.div
            className="fixed inset-0 z-[72] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.button
              type="button"
              className="absolute inset-0 bg-black/65 backdrop-blur-sm"
              aria-label="إغلاق نافذة قصص الأنبياء"
              onClick={() => {
                stopStoryNarration();
                setShowProphetStories(false);
              }}
            />

            <motion.div
              className="relative w-full max-w-5xl h-[min(90vh,820px)] rounded-3xl border border-blue-300/30 p-4 sm:p-6 md:p-7 flex flex-col"
              style={{ background: 'linear-gradient(155deg, rgba(10,22,49,0.96), rgba(35,20,78,0.95))' }}
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.97, y: 8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            >
              <div className="flex items-center justify-between mb-4" dir="rtl">
                <div className="min-w-0">
                  <h3 className="text-white font-black text-xl sm:text-2xl md:text-3xl">قصص الأنبياء</h3>
                  <p className="text-white/60 text-xs sm:text-sm mt-1">قصة موسعة • معلومات أساسية • درس عملي • تطبيق يومي</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-end">
                  {speechSupported && (
                    <button
                      type="button"
                      onClick={speakCurrentStory}
                      className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition min-h-11 ${isStorySpeaking ? 'bg-red-300 text-red-900 hover:bg-red-200' : 'bg-cyan-300 text-slate-900 hover:bg-cyan-200'}`}
                    >
                      {isStorySpeaking ? '⏹ إيقاف الصوت' : '🔊 قراءة القصة'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      stopStoryNarration();
                      setShowProphetStories(false);
                    }}
                    className="w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                    aria-label="إغلاق"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="mb-4" dir="rtl">
                <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                  <span>تقدم القصص</span>
                  <span>{prophetStoryIndex + 1} / {prophetStories.length}</span>
                </div>
                <div className="h-2 rounded-full bg-white/15 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #22d3ee, #facc15)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${((prophetStoryIndex + 1) / prophetStories.length) * 100}%` }}
                    transition={{ duration: 0.35 }}
                  />
                </div>
              </div>

              <motion.div
                key={`${currentStory.prophet}-${prophetStoryIndex}`}
                className="rounded-2xl border border-white/15 bg-white/5 p-3 sm:p-5 flex-1 min-h-0 overflow-y-auto"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                dir="rtl"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl">{currentStory.icon}</span>
                  <div>
                    <p className="text-cyan-200 text-base font-bold">{currentStory.prophet}</p>
                    <h4 className="text-white font-black text-xl sm:text-2xl">{currentStory.title}</h4>
                  </div>
                </div>

                <p className="text-white/95 text-base sm:text-lg leading-8 sm:leading-9 mb-3">{currentStory.summary}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div className="rounded-xl bg-cyan-400/10 border border-cyan-300/20 p-3">
                    <p className="text-cyan-200 text-sm font-bold mb-1">المكان</p>
                    <p className="text-white/95 text-sm sm:text-base">{currentStory.place}</p>
                  </div>
                  <div className="rounded-xl bg-indigo-400/10 border border-indigo-300/20 p-3">
                    <p className="text-indigo-200 text-sm font-bold mb-1">الفترة</p>
                    <p className="text-white/95 text-sm sm:text-base">{currentStory.period}</p>
                  </div>
                </div>

                <div className="rounded-xl bg-white/5 border border-white/15 p-3 mb-3">
                  <p className="text-white/80 text-sm font-bold mb-2">معلومات أكثر</p>
                  <ul className="space-y-1.5">
                    {currentStory.keyFacts.map((fact, idx) => (
                      <li key={idx} className="text-white/95 text-sm sm:text-base leading-7 sm:leading-8">• {fact}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl bg-yellow-400/10 border border-yellow-300/20 p-3 mb-3">
                  <p className="text-yellow-200 text-sm font-bold mb-1">الدرس المستفاد</p>
                  <p className="text-white/95 text-sm sm:text-base leading-7 sm:leading-8">{currentStory.lesson}</p>
                </div>

                <div className="rounded-xl bg-emerald-400/10 border border-emerald-300/20 p-3">
                  <p className="text-emerald-200 text-sm font-bold mb-1">تطبيق اليوم</p>
                  <p className="text-white/95 text-sm sm:text-base leading-7 sm:leading-8">{currentStory.action}</p>
                </div>

                <div className="rounded-xl bg-fuchsia-400/10 border border-fuchsia-300/25 p-3 mt-3">
                  <p className="text-fuchsia-200 text-sm font-bold mb-2">تحدي البطل الصغير</p>
                  <p className="text-white/95 text-sm sm:text-base leading-7 sm:leading-8 mb-2">{currentStory.challengeQuestion}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {currentStory.challengeOptions.map((option, idx) => {
                      const isSelected = storySelectedOption === idx;
                      const isCorrect = idx === currentStory.challengeCorrectIndex;
                      const showResult = storySelectedOption !== null;

                      let buttonClass = 'bg-white/10 text-white hover:bg-white/20';
                      if (showResult && isCorrect) buttonClass = 'bg-emerald-300 text-emerald-950';
                      if (showResult && isSelected && !isCorrect) buttonClass = 'bg-rose-300 text-rose-950';

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleStoryAnswer(idx)}
                          className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition min-h-11 ${buttonClass}`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                  {storySelectedOption !== null && (
                    <p className={`mt-2 text-sm font-bold ${storySelectedOption === currentStory.challengeCorrectIndex ? 'text-emerald-200' : 'text-rose-200'}`}>
                      {storySelectedOption === currentStory.challengeCorrectIndex
                        ? 'إجابة رائعة! أنت بطل القصة اليوم.'
                        : 'محاولة جميلة. فكر في الدرس المستفاد ثم جرّب القصة التالية.'}
                    </p>
                  )}
                </div>
              </motion.div>

              <div className="flex flex-wrap items-center justify-between gap-2 mt-5" dir="rtl">
                <div className="flex gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={goToPrevStory}
                    className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs sm:text-sm md:text-base hover:bg-white/20 transition min-h-11"
                  >
                    السابق
                  </button>
                  <button
                    type="button"
                    onClick={goToNextStory}
                    className="px-4 py-2 rounded-xl bg-cyan-300 text-slate-900 text-xs sm:text-sm md:text-base font-bold hover:bg-cyan-200 transition min-h-11"
                  >
                    التالي
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowProphetStories(false);
                    setShowJuzAmma(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-yellow-300 text-purple-900 text-xs sm:text-sm md:text-base font-bold hover:bg-yellow-200 transition min-h-11"
                >
                  تابع رحلة القرآن
                </button>
              </div>

              <div className="mt-3 flex justify-center gap-1.5">
                {prophetStories.map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-2 h-2 rounded-full ${idx === prophetStoryIndex ? 'bg-yellow-300' : 'bg-white/25'}`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showStoryCelebrate && (
          <motion.div
            className="fixed inset-0 z-[73] pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="px-6 py-3 rounded-2xl bg-emerald-300 text-emerald-950 font-black text-lg shadow-2xl"
              initial={{ scale: 0.8, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: -8, opacity: 0 }}
            >
              ممتاز! إجابة صحيحة 🌟
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
