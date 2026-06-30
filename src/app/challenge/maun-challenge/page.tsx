"use client";
import React from 'react';
import { AL_MAUN_AYAT } from '@/lib/juzAmmaData';
import ChallengeScreen from '@/challenge/index';

export default function MaunChallengePage() {
  const ayat = AL_MAUN_AYAT.map((a: any) => a.arabic);
  
  return <ChallengeScreen ayat={ayat} surahName="سورة الماعون" surahId={107} />;
}
