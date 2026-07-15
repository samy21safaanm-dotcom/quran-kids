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
    <div dir="rtl" className="min-h-screen flex flex-col relative overflow-hidden overflow-x-hidden">
      {/* فرض خلفية التحدي الموحدة */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img src="/images/challenge-bg.png" alt="خلفية التحدي" className="w-full h-full object-cover" />
      </div>
      {/* باقي عناصر الصفحة */}
      <ChallengeHeader surahName={surahName} stars={stars} xp={xp} />
      <div className="flex-1 flex flex-col lg:flex-row-reverse gap-4 sm:gap-6 lg:gap-8 px-3 sm:px-4 md:px-8 lg:px-12 py-4 sm:py-6 lg:py-8 relative z-10">
        {/* RIGHT: Sidebar */}
        <div className="w-full lg:w-80 xl:w-84 flex-shrink-0 mb-2 lg:mb-0">
          <ChallengeSidebar child={child} progress={progress} />
        </div>
        {/* LEFT: Main challenge area */}
        <div className="w-full flex-1 flex flex-col items-center justify-center relative bg-white/40 rounded-3xl shadow-xl p-3 sm:p-4 md:p-5 lg:p-6 min-h-[clamp(22rem,58vh,31.25rem)]">
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
