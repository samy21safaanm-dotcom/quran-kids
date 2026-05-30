export type Character  = 'noor' | 'lujain' | null;
export type AgeGroup   = '4-6' | '7-10' | '11-14' | null;
export type AppStep    = 'gender' | 'video' | 'chat' | 'experience';

export interface AppState {
  character:  Character;
  childName:  string;
  ageGroup:   AgeGroup;
  step:       AppStep;
}

export const initialState: AppState = {
  character: null,
  childName: '',
  ageGroup:  null,
  step:      'gender',
};

export const ageGroupConfig = {
  '4-6': {
    label:       '٤ - ٦ سنوات',
    emoji:       '🌱',
    description: 'الأطفال الصغار',
    theme:       'young',
    colors: {
      primary:  '#FF6B6B',
      secondary:'#FFE66D',
      accent:   '#FF8E53',
      bg:       'from-red-900/20 to-yellow-900/20',
    },
    fontSize:   'text-2xl',
    buttonSize: 'py-5 px-10 text-xl',
  },
  '7-10': {
    label:       '٧ - ١٠ سنوات',
    emoji:       '⚡',
    description: 'المغامرون الصغار',
    theme:       'mid',
    colors: {
      primary:  '#4ECDC4',
      secondary:'#45B7D1',
      accent:   '#96CEB4',
      bg:       'from-teal-900/20 to-blue-900/20',
    },
    fontSize:   'text-xl',
    buttonSize: 'py-4 px-8 text-lg',
  },
  '11-14': {
    label:       '١١ - ١٤ سنة',
    emoji:       '🚀',
    description: 'الفتيان والفتيات',
    theme:       'teen',
    colors: {
      primary:  '#7C3AED',
      secondary:'#0EA5E9',
      accent:   '#A78BFA',
      bg:       'from-purple-900/20 to-blue-900/20',
    },
    fontSize:   'text-lg',
    buttonSize: 'py-3 px-7 text-base',
  },
};
