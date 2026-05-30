'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  twinkleOffset: number;
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      starsRef.current = Array.from({ length: 200 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.3 + 0.05,
        twinkleOffset: Math.random() * Math.PI * 2,
      }));
    };

    const drawStar = (star: Star, time: number) => {
      const twinkle = Math.sin(time * star.speed * 2 + star.twinkleOffset) * 0.4 + 0.6;
      const opacity = star.opacity * twinkle;

      // Glow effect for larger stars
      if (star.size > 1.5) {
        const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 4);
        gradient.addColorStop(0, `rgba(255, 240, 180, ${opacity})`);
        gradient.addColorStop(0.5, `rgba(245, 200, 66, ${opacity * 0.3})`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = `rgba(255, 248, 220, ${opacity})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawShootingStar = (time: number) => {
      const cycle = time % 8;
      if (cycle < 0.5) {
        const progress = cycle / 0.5;
        const startX = canvas.width * 0.8;
        const startY = canvas.height * 0.1;
        const length = 150;
        const x = startX - progress * length;
        const y = startY + progress * 60;

        const gradient = ctx.createLinearGradient(x, y, x + length * 0.3, y - 20);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(0.5, 'rgba(245, 200, 66, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.9)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + length * 0.3, y - 20);
        ctx.stroke();
      }
    };

    const animate = (timestamp: number) => {
      timeRef.current = timestamp / 1000;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      starsRef.current.forEach(star => drawStar(star, timeRef.current));
      drawShootingStar(timeRef.current);

      animFrameRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.9 }}
    />
  );
}
