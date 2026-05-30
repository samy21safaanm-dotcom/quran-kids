export type ChallengeType = 'order' | 'image' | 'complete' | 'voice';

export interface ChallengeData {
  ayat: string[];
  images?: string[];
  question?: string;
  options?: string[];
  audioUrl?: string;
  answer?: string | string[];
}

export interface CompleteAyahChallengeData {
  ayahStart: string;
  ayahRest: string;
  audioUrl?: string;
}

export interface ChildProfile {
  name: string;
  age: number;
  gender: 'boy' | 'girl';
  level: number;
  stars: number;
  completedSurahs: number;
}
