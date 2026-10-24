import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Particle {
  x: number;
  y: number;
  radius: number;
  density: number;
  speedY: number;
  speedX: number;
  opacity: number;
  swaySpeed: number;
  swayAngle: number;
  isCrystal: boolean;
}

export const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle setup
    const particleCount = Math.min(65, Math.floor((width * height) / 18000));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.8 + 1.2,
        density: Math.random() * particleCount,
        speedY: Math.random() * 0.8 + 0.4,
        speedX: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.6 + 0.25,
        swaySpeed: Math.random() * 0.02 + 0.01,
        swayAngle: Math.random() * Math.PI * 2,
        isCrystal: i % 3 === 0 // 1 in 3 is an intricate snowflake crystal
      });
    }

    // Interactive mouse displacement
    let mouseX = -1000;
    let mouseY = -1000;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const drawSnowflake = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      radius: number,
      opacity: number,
      color: string
    ) => {
      context.save();
      context.translate(x, y);
      context.strokeStyle = color;
      context.lineWidth = 1;
      context.globalAlpha = opacity;

      // 6-branch snowflake crystal
      for (let i = 0; i < 6; i++) {
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(0, -radius * 1.8);
        context.stroke();

        // Small decorative side branches
        context.beginPath();
        context.moveTo(0, -radius * 0.9);
        context.lineTo(-radius * 0.5, -radius * 1.3);
        context.moveTo(0, -radius * 0.9);
        context.lineTo(radius * 0.5, -radius * 1.3);
        context.stroke();

        context.rotate(Math.PI / 3);
      }
      context.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Determine palette based on theme
      const isLiquid = theme === 'liquid-glass';
      const isDark = theme === 'dark' || isLiquid;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Natural swaying motion
        p.swayAngle += p.swaySpeed;
        p.x += Math.sin(p.swayAngle) * 0.7 + p.speedX;
        p.y += p.speedY;

        // Gentle interactive avoidance if mouse is near
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (100 - dist) / 100;
          p.x += (dx / dist) * force * 2.5;
          p.y += (dy / dist) * force * 2.5;
        }

        // Wrap around boundaries
        if (p.y > height + 10) {
          p.y = -10;
          p.x = Math.random() * width;
        }
        if (p.x > width + 10) p.x = -10;
        if (p.x < -10) p.x = width + 10;

        // Choose colors
        const particleColor = isLiquid
          ? `rgba(167, 243, 208, ${p.opacity})` // soft luminous mint
          : isDark
          ? `rgba(110, 231, 183, ${p.opacity * 0.85})` // emerald frost
          : `rgba(20, 184, 166, ${p.opacity * 0.65})`; // gentle teal crystal

        if (p.isCrystal && p.radius > 2.0) {
          drawSnowflake(ctx, p.x, p.y, p.radius, p.opacity, particleColor);
        } else {
          // Soft glowing circular snow particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
          ctx.fillStyle = particleColor;
          ctx.shadowBlur = isDark ? 8 : 4;
          ctx.shadowColor = isDark ? 'rgba(52, 211, 153, 0.4)' : 'rgba(20, 184, 166, 0.2)';
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
      aria-hidden="true"
    />
  );
};
