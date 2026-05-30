export interface Surah {
  id:       number;
  name:     string;
  nameEn:   string;
  ayat:     number;
  type:     'مكية' | 'مدنية';
  color:    string;
  glow:     string;
  icon:     string;
  progress: number;
  stars:    number;
  story?:   string;
}

export const JUZ_AMMA: Surah[] = [
  { id: 78,  name: 'النبأ',       nameEn: 'An-Naba',       ayat: 40, type: 'مكية',  color: '#F5C842', glow: 'rgba(245,200,66,0.5)',  icon: '🌅', progress: 0,   stars: 0 },
  { id: 79,  name: 'النازعات',    nameEn: 'An-Naziat',     ayat: 46, type: 'مكية',  color: '#60A5FA', glow: 'rgba(96,165,250,0.5)',  icon: '⚡', progress: 0,   stars: 0 },
  { id: 80,  name: 'عبس',         nameEn: 'Abasa',         ayat: 42, type: 'مكية',  color: '#34D399', glow: 'rgba(52,211,153,0.5)',  icon: '🌿', progress: 0,   stars: 0 },
  { id: 81,  name: 'التكوير',     nameEn: 'At-Takwir',     ayat: 29, type: 'مكية',  color: '#F97316', glow: 'rgba(249,115,22,0.5)',  icon: '🌞', progress: 0,   stars: 0 },
  { id: 82,  name: 'الانفطار',    nameEn: 'Al-Infitar',    ayat: 19, type: 'مكية',  color: '#A78BFA', glow: 'rgba(167,139,250,0.5)', icon: '💫', progress: 0,   stars: 0 },
  { id: 83,  name: 'المطففين',    nameEn: 'Al-Mutaffifin', ayat: 36, type: 'مكية',  color: '#FB7185', glow: 'rgba(251,113,133,0.5)', icon: '⚖️', progress: 0,   stars: 0 },
  { id: 84,  name: 'الانشقاق',    nameEn: 'Al-Inshiqaq',   ayat: 25, type: 'مكية',  color: '#38BDF8', glow: 'rgba(56,189,248,0.5)',  icon: '🌌', progress: 0,   stars: 0 },
  { id: 85,  name: 'البروج',      nameEn: 'Al-Buruj',      ayat: 22, type: 'مكية',  color: '#FBBF24', glow: 'rgba(251,191,36,0.5)',  icon: '🏰', progress: 0,   stars: 0 },
  { id: 86,  name: 'الطارق',      nameEn: 'At-Tariq',      ayat: 17, type: 'مكية',  color: '#818CF8', glow: 'rgba(129,140,248,0.5)', icon: '⭐', progress: 0,   stars: 0 },
  { id: 87,  name: 'الأعلى',      nameEn: 'Al-Ala',        ayat: 19, type: 'مكية',  color: '#4ADE80', glow: 'rgba(74,222,128,0.5)',  icon: '🌱', progress: 0,   stars: 0 },
  { id: 88,  name: 'الغاشية',     nameEn: 'Al-Ghashiyah',  ayat: 26, type: 'مكية',  color: '#F472B6', glow: 'rgba(244,114,182,0.5)', icon: '🌊', progress: 0,   stars: 0 },
  { id: 89,  name: 'الفجر',       nameEn: 'Al-Fajr',       ayat: 30, type: 'مكية',  color: '#FB923C', glow: 'rgba(251,146,60,0.5)',  icon: '🌄', progress: 0,   stars: 0 },
  { id: 90,  name: 'البلد',       nameEn: 'Al-Balad',      ayat: 20, type: 'مكية',  color: '#2DD4BF', glow: 'rgba(45,212,191,0.5)',  icon: '🏙️', progress: 0,   stars: 0 },
  { id: 91,  name: 'الشمس',       nameEn: 'Ash-Shams',     ayat: 15, type: 'مكية',  color: '#FDE047', glow: 'rgba(253,224,71,0.5)',  icon: '☀️', progress: 0,   stars: 0 },
  { id: 92,  name: 'الليل',       nameEn: 'Al-Layl',       ayat: 21, type: 'مكية',  color: '#6366F1', glow: 'rgba(99,102,241,0.5)',  icon: '🌙', progress: 0,   stars: 0 },
  { id: 93,  name: 'الضحى',       nameEn: 'Ad-Duha',       ayat: 11, type: 'مكية',  color: '#F59E0B', glow: 'rgba(245,158,11,0.5)',  icon: '🌤️', progress: 0,   stars: 0 },
  { id: 94,  name: 'الشرح',       nameEn: 'Ash-Sharh',     ayat: 8,  type: 'مكية',  color: '#10B981', glow: 'rgba(16,185,129,0.5)',  icon: '💚', progress: 0,   stars: 0 },
  { id: 95,  name: 'التين',       nameEn: 'At-Tin',        ayat: 8,  type: 'مكية',  color: '#84CC16', glow: 'rgba(132,204,22,0.5)',  icon: '🍃', progress: 0,   stars: 0 },
  { id: 96,  name: 'العلق',       nameEn: 'Al-Alaq',       ayat: 19, type: 'مكية',  color: '#EC4899', glow: 'rgba(236,72,153,0.5)',  icon: '📖', progress: 0,   stars: 0 },
  { id: 97,  name: 'القدر',       nameEn: 'Al-Qadr',       ayat: 5,  type: 'مكية',  color: '#8B5CF6', glow: 'rgba(139,92,246,0.5)',  icon: '✨', progress: 0,   stars: 0 },
  { id: 98,  name: 'البينة',      nameEn: 'Al-Bayyinah',   ayat: 8,  type: 'مدنية', color: '#06B6D4', glow: 'rgba(6,182,212,0.5)',   icon: '📜', progress: 0,   stars: 0 },
  { id: 99,  name: 'الزلزلة',     nameEn: 'Az-Zalzalah',   ayat: 8,  type: 'مدنية', color: '#EF4444', glow: 'rgba(239,68,68,0.5)',   icon: '🌍', progress: 0,   stars: 0 },
  { id: 100, name: 'العاديات',    nameEn: 'Al-Adiyat',     ayat: 11, type: 'مكية',  color: '#F97316', glow: 'rgba(249,115,22,0.5)',  icon: '🐎', progress: 0,   stars: 0 },
  { id: 101, name: 'القارعة',     nameEn: 'Al-Qariah',     ayat: 11, type: 'مكية',  color: '#DC2626', glow: 'rgba(220,38,38,0.5)',   icon: '⚡', progress: 0,   stars: 0 },
  { id: 102, name: 'التكاثر',     nameEn: 'At-Takathur',   ayat: 8,  type: 'مكية',  color: '#7C3AED', glow: 'rgba(124,58,237,0.5)',  icon: '💎', progress: 0,   stars: 0 },
  { id: 103, name: 'العصر',       nameEn: 'Al-Asr',        ayat: 3,  type: 'مكية',  color: '#D97706', glow: 'rgba(217,119,6,0.5)',   icon: '⏳', progress: 0,   stars: 0 },
  { id: 104, name: 'الهمزة',      nameEn: 'Al-Humazah',    ayat: 9,  type: 'مكية',  color: '#BE185D', glow: 'rgba(190,24,93,0.5)',   icon: '🔥', progress: 0,   stars: 0 },
  { id: 105, name: 'الفيل',       nameEn: 'Al-Fil',        ayat: 5,  type: 'مكية',  color: '#059669', glow: 'rgba(5,150,105,0.5)',   icon: '🐘', progress: 60,  stars: 2, story: 'al-feel-story.mp4' },
  { id: 106, name: 'قريش',        nameEn: 'Quraysh',       ayat: 4,  type: 'مكية',  color: '#0284C7', glow: 'rgba(2,132,199,0.5)',   icon: '🕌', progress: 0,   stars: 0 },
  { id: 107, name: 'الماعون',     nameEn: 'Al-Maun',       ayat: 7,  type: 'مكية',  color: '#7C3AED', glow: 'rgba(124,58,237,0.5)',  icon: '🤲', progress: 0,   stars: 0 },
  { id: 108, name: 'الكوثر',      nameEn: 'Al-Kawthar',    ayat: 3,  type: 'مكية',  color: '#0EA5E9', glow: 'rgba(14,165,233,0.5)',  icon: '🌊', progress: 100, stars: 3 },
  { id: 109, name: 'الكافرون',    nameEn: 'Al-Kafirun',    ayat: 6,  type: 'مكية',  color: '#DC2626', glow: 'rgba(220,38,38,0.5)',   icon: '🛡️', progress: 0,   stars: 0 },
  { id: 110, name: 'النصر',       nameEn: 'An-Nasr',       ayat: 3,  type: 'مدنية', color: '#16A34A', glow: 'rgba(22,163,74,0.5)',   icon: '🏆', progress: 0,   stars: 0 },
  { id: 111, name: 'المسد',       nameEn: 'Al-Masad',      ayat: 5,  type: 'مكية',  color: '#B45309', glow: 'rgba(180,83,9,0.5)',    icon: '🔥', progress: 0,   stars: 0 },
  { id: 112, name: 'الإخلاص',     nameEn: 'Al-Ikhlas',     ayat: 4,  type: 'مكية',  color: '#F5C842', glow: 'rgba(245,200,66,0.5)',  icon: '💛', progress: 80,  stars: 3, story: 'al-ikhlas-story.mp4' },
  { id: 113, name: 'الفلق',       nameEn: 'Al-Falaq',      ayat: 5,  type: 'مكية',  color: '#F97316', glow: 'rgba(249,115,22,0.5)',  icon: '🌅', progress: 0,   stars: 0, story: 'al-falaq-story.mp4' },
  { id: 114, name: 'الناس',       nameEn: 'An-Nas',        ayat: 6,  type: 'مكية',  color: '#8B5CF6', glow: 'rgba(139,92,246,0.5)',  icon: '👥', progress: 0,   stars: 0 },
];

export interface Ayah {
  number: number;
  arabic: string;
  tafsir: string;
}

export const AL_FIL_AYAT: Ayah[] = [
  { number: 1, arabic: 'أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ', tafsir: 'ألم تعلم يا محمد كيف فعل ربك بأصحاب الفيل الذين جاؤوا ليهدموا الكعبة المشرفة؟' },
  { number: 2, arabic: 'أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ', tafsir: 'ألم يجعل الله مكرهم وخطتهم الشريرة في ضياع وخسارة؟ نعم، أبطل الله كيدهم.' },
  { number: 3, arabic: 'وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ', tafsir: 'وأرسل الله عليهم طيوراً كثيرة تأتي جماعات جماعات من كل جهة.' },
  { number: 4, arabic: 'تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ', tafsir: 'هذه الطيور كانت ترمي الجنود بحجارة صغيرة من طين متحجر.' },
  { number: 5, arabic: 'فَجَعَلَهُمْ كَعَصْفٍ مَّأْكُولٍ', tafsir: 'فصار الجنود مثل أوراق الزرع التي أكلتها الدواب، ممزقة لا قيمة لها.' },
];

export const AL_IKHLAS_AYAT: Ayah[] = [
  { number: 1, arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ', tafsir: 'قل يا محمد: الله واحد لا شريك له، وهو الإله الحق الذي لا إله غيره.' },
  { number: 2, arabic: 'اللَّهُ الصَّمَدُ', tafsir: 'الله هو الصمد، أي السيد الذي يحتاج إليه كل شيء، وهو لا يحتاج إلى أحد.' },
  { number: 3, arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', tafsir: 'الله لم يُنجب أحداً ولم يُولد من أحد، فهو منزّه عن ذلك كله.' },
  { number: 4, arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', tafsir: 'ولا يوجد أحد مثل الله أو يساويه، فهو الأحد الفرد الذي لا نظير له.' },
];

export const AL_FALAQ_AYAT: Ayah[] = [
  { number: 1, arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', tafsir: 'قل يا محمد: أستعيذ وأعتصم برب الصبح الذي يفلق الظلام بالنور.' },
  { number: 2, arabic: 'مِن شَرِّ مَا خَلَقَ', tafsir: 'من شر كل ما خلق الله من مخلوقات قد يؤذي.' },
  { number: 3, arabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ', tafsir: 'ومن شر الليل إذا أظلم وأقبل بظلامه، فإن الشرور تكثر في الليل.' },
  { number: 4, arabic: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ', tafsir: 'ومن شر الساحرات اللاتي ينفثن في عقد الخيوط عند السحر.' },
  { number: 5, arabic: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ', tafsir: 'ومن شر كل حاسد إذا أظهر حسده وعمل على إيذاء المحسود.' },
];

export const AL_NAS_AYAT: Ayah[] = [
  { number: 1, arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', tafsir: 'قل يا محمد: أستعيذ وأعتصم برب الناس وخالقهم.' },
  { number: 2, arabic: 'مَلِكِ النَّاسِ', tafsir: 'ملك جميع الناس والمتصرف في أمورهم.' },
  { number: 3, arabic: 'إِلَٰهِ النَّاسِ', tafsir: 'إله جميع الناس ومعبودهم الحق.' },
  { number: 4, arabic: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', tafsir: 'من شر الشيطان الذي يوسوس في القلوب ثم يختفي عند ذكر الله.' },
  { number: 5, arabic: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', tafsir: 'الذي يلقي الوساوس والأفكار السيئة في قلوب الناس.' },
  { number: 6, arabic: 'مِنَ الْجِنَّةِ وَالنَّاسِ', tafsir: 'هذا الموسوس قد يكون من الجن أو من الإنس الذين يوسوسون للآخرين.' },
];

export const RECITERS = [
  { id: 'minshawi', name: 'محمد صديق المنشاوي', style: 'مرتل' },
  { id: 'afasy',    name: 'مشاري العفاسي',       style: 'مجود' },
];
