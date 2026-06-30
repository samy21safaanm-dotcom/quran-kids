"use client";
import React from 'react';
import { AL_FIL_AYAT } from '@/lib/juzAmmaData';
import ChallengeScreen from '@/challenge/index';

export default function FilChallengePage() {
  const ayat = AL_FIL_AYAT.map((a: any) => a.arabic);
  
  return <ChallengeScreen ayat={ayat} surahName="سورة الفيل" surahId={105} />;
}
