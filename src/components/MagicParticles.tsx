'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

const COLORS = [
  'rgba(245, 200, 66,',   // gold
  'rgba(167, 139, 250,',  // purple light
  'rgba(14, 165, 233,',   // sky
  'rgba(255, 255, 255,',  // white
  'rgba(236, 72, 153,',   // pink
];

export default function MagicParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      size: Math.random() * 4 + 1,
      speedY: -(Math.random() * 1.5 + 0.5),
      speedX: (Math.random() - 0.5) * 0.8,
      opacity: Math.random() * 0.7 + 0.3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      life: 0,
      maxLife: Math.random() * 200 + 100,
    });

    // Initialize with some particles
    for (let i = 0; i < 40; i++) {
      const p = createParticle();
      p.y = Math.random() * canvas.height;
      p.life = Math.random() * p.maxLife;
      particlesRef.current.push(p);
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add new particles
      if (particlesRef.current.length < 60 && Math.random() < 0.3) {
        particlesRef.current.push(createParticle());
      }

      particlesRef.current = particlesRef.current.filter(p => {
        p.life++;
        p.y += p.speedY;
        p.x += p.speedX;

        const lifeRatio = p.life / p.maxLife;
        const currentOpacity = lifeRatio < 0.1
          ? p.opacity * (lifeRatio / 0.1)
          : lifeRatio > 0.8
          ? p.opacity * (1 - (lifeRatio - 0.8) / 0.2)
          : p.opacity;

        // Draw sparkle
        ctx.save();
        ctx.translate(p.x, p.y);

        // Glow
        const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 3);
        glow.addColorStop(0, `${p.color}${currentOpacity})`);
        glow.addColorStop(1, `${p.color}0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = `${p.color}${currentOpacity})`;
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Star shape for larger particles
        if (p.size > 2.5) {
          ctx.strokeStyle = `${p.color}${currentOpacity * 0.6})`;
          ctx.lineWidth = 0.5;
          for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2 + p.life * 0.02;
            ctx.beginPath();
            ctx.moveTo(Math.cos(angle) * p.size * 0.5, Math.sin(angle) * p.size * 0.5);
            ctx.lineTo(Math.cos(angle) * p.size * 2.5, Math.sin(angle) * p.size * 2.5);
            ctx.stroke();
          }
        }

        ctx.restore();

        return p.life < p.maxLife && p.y > -20;
      });

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
      style={{ opacity: 0.6 }}
    />
  );
}
