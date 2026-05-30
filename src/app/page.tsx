'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import StarField from '@/components/StarField';
import MagicParticles from '@/components/MagicParticles';
import GenderSelection from '@/components/GenderSelection';
import VideoExperience from '@/components/VideoExperience';
import ChatExperience from '@/components/ChatExperience';
import MainExperience from '@/components/MainExperience';
import type { Character, AgeGroup, AppStep } from '@/lib/store';

export default function Home() {
  const [step, setStep] = useState<AppStep>('gender');
  const [character, setCharacter] = useState<Character>(null);
  const [childName, setChildName] = useState('');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(null);

  const handleCharacterSelect = useCallback((char: Character) => {
    setCharacter(char);
    setStep('video');
  }, []);

  const handleVideoComplete = useCallback(() => {
    setStep('chat');
  }, []);

  const handleChatComplete = useCallback((name: string, age: AgeGroup) => {
    setChildName(name);
    setAgeGroup(age);
    setStep('experience');
  }, []);

  const handleRestart = useCallback(() => {
    setStep('gender');
    setCharacter(null);
    setChildName('');
    setAgeGroup(null);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Always-on background layers */}
      <StarField />
      <MagicParticles />

      {/* Page transitions */}
      <AnimatePresence mode="wait">
        {step === 'gender' && (
          <GenderSelection
            key="gender"
            onSelect={handleCharacterSelect}
          />
        )}

        {step === 'video' && character && (
          <VideoExperience
            key="video"
            character={character}
            onComplete={handleVideoComplete}
          />
        )}

        {step === 'chat' && character && (
          <ChatExperience
            key="chat"
            character={character}
            onComplete={handleChatComplete}
          />
        )}

        {step === 'experience' && character && (
          <MainExperience
            key="experience"
            character={character}
            childName={childName}
            ageGroup={ageGroup}
            onRestart={handleRestart}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
