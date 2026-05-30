import React from 'react';
import { motion } from 'framer-motion';
import ChallengeHeader from './ChallengeHeader';
import ChallengeSidebar from './ChallengeSidebar';
import ChallengeProgress from './ChallengeProgress';
import ChallengeSuccess from './ChallengeSuccess';
import type { ChallengeType, ChallengeData, ChildProfile } from './types';

interface Props {
  surahName: string;
  challengeType: ChallengeType;
  challengeData: ChallengeData;
  child: ChildProfile;
  progress: number;
  stars: number;
  xp: number;
  onNext: () => void;
  onRetry: () => void;
  onBack: () => void;
  onSuccess: () => void;
  children: React.ReactNode;
  showSuccess?: boolean;
}

export default function ChallengeLayout({
  surahName,
  challengeType,
  challengeData,
  child,
  progress,
  stars,
  xp,
  onNext,
  onRetry,
  onBack,
  onSuccess,
  children,
  showSuccess = false,
}: Props) {
  return (
    <div dir="rtl" className="min-h-screen flex flex-col relative overflow-hidden">
      {/* فرض خلفية التحدي الموحدة */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img src="/images/challenge-bg.png" alt="خلفية التحدي" className="w-full h-full object-cover" />
      </div>
      {/* باقي عناصر الصفحة */}
      <ChallengeHeader surahName={surahName} stars={stars} xp={xp} />
      <div className="flex-1 flex flex-col md:flex-row-reverse gap-8 px-2 md:px-12 py-8 relative z-10">
        {/* RIGHT: Sidebar */}
        <div className="w-full md:w-80 flex-shrink-0 mb-8 md:mb-0">
          <ChallengeSidebar child={child} progress={progress} />
        </div>
        {/* LEFT: Main challenge area */}
        <div className="flex-1 flex flex-col items-center justify-center relative bg-white/40 rounded-3xl shadow-xl p-6 min-h-[500px]">
          {showSuccess ? (
            <ChallengeSuccess onNext={onNext} />
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}
