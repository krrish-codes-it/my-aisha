/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

interface BackgroundCanvasProps {
  flowerType?: 'tulip' | 'lotus' | 'rose' | 'jasmine' | 'marigold' | 'orchid';
  primaryColor?: string;
  intensity?: number;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
  type: 'tulip' | 'lotus' | 'rose' | 'jasmine' | 'marigold' | 'orchid';
  swayOffset: number;
}

interface Sparkle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  alphaSpeed: number;
  speedY: number;
  color: string;
}

export const BackgroundCanvas: React.FC<BackgroundCanvasProps> = ({
  flowerType = 'tulip',
  primaryColor = '#f472b6',
  intensity = 1.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Color palettes according to flower type
    const petalPalettes: Record<string, string[]> = {
      tulip: ['#f472b6', '#fb7185', '#fda4af', '#fecdd3', '#ffffff'],
      lotus: ['#f43f5e', '#ec4899', '#fbcfe8', '#ffffff', '#2dd4bf'],
      rose: ['#e11d48', '#be123c', '#fb7185', '#9f1239', '#ffe4e6'],
      jasmine: ['#ffffff', '#fef08a', '#fef9c3', '#ecfdf5', '#e0e7ff'],
      marigold: ['#f59e0b', '#d97706', '#fbbf24', '#fef3c7', '#ea580c'],
      orchid: ['#c084fc', '#a855f7', '#d8b4fe', '#f3e8ff', '#e879f9'],
    };

    const colors = petalPalettes[flowerType] || petalPalettes.tulip;

    // Create Petals
    const petalCount = Math.floor(35 * intensity);
    const petals: Petal[] = Array.from({ length: petalCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 10 + Math.random() * 16,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      speedX: -0.6 + Math.random() * 1.2,
      speedY: 0.6 + Math.random() * 1.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 0.35 + Math.random() * 0.55,
      type: flowerType,
      swayOffset: Math.random() * Math.PI * 2,
    }));

    // Create Sparkles
    const sparkleCount = Math.floor(45 * intensity);
    const sparkles: Sparkle[] = Array.from({ length: sparkleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 1 + Math.random() * 2.8,
      alpha: Math.random(),
      alphaSpeed: 0.008 + Math.random() * 0.02,
      speedY: -(0.2 + Math.random() * 0.6),
      color: Math.random() > 0.4 ? '#ffd700' : '#ffffff',
    }));

    // Helper to draw petal shapes
    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;

      ctx.beginPath();
      if (p.type === 'lotus') {
        // Pointed graceful lotus petal
        ctx.moveTo(0, -p.size);
        ctx.quadraticCurveTo(p.size * 0.6, -p.size * 0.3, p.size * 0.4, p.size * 0.5);
        ctx.quadraticCurveTo(0, p.size * 0.8, -p.size * 0.4, p.size * 0.5);
        ctx.quadraticCurveTo(-p.size * 0.6, -p.size * 0.3, 0, -p.size);
      } else if (p.type === 'tulip') {
        // Cup-like curved tulip petal
        ctx.moveTo(0, -p.size * 0.8);
        ctx.bezierCurveTo(p.size * 0.7, -p.size * 0.4, p.size * 0.7, p.size * 0.4, 0, p.size * 0.8);
        ctx.bezierCurveTo(-p.size * 0.7, p.size * 0.4, -p.size * 0.7, -p.size * 0.4, 0, -p.size * 0.8);
      } else {
        // Rounded velvety rose/jasmine petal
        ctx.moveTo(0, -p.size * 0.7);
        ctx.bezierCurveTo(p.size * 0.5, -p.size * 0.6, p.size * 0.6, p.size * 0.3, 0, p.size * 0.7);
        ctx.bezierCurveTo(-p.size * 0.6, p.size * 0.3, -p.size * 0.5, -p.size * 0.6, 0, -p.size * 0.7);
      }
      ctx.fill();
      ctx.restore();
    };

    let tick = 0;
    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle ambient glow orbs in background
      ctx.save();
      const grad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.4,
        40,
        width * 0.5,
        height * 0.4,
        width * 0.6
      );
      grad.addColorStop(0, primaryColor + '18');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // Render & update Sparkles
      for (const s of sparkles) {
        s.alpha += s.alphaSpeed;
        if (s.alpha > 1 || s.alpha < 0.1) {
          s.alphaSpeed = -s.alphaSpeed;
        }
        s.y += s.speedY;
        if (s.y < -10) {
          s.y = height + 10;
          s.x = Math.random() * width;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, s.alpha));
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();

        // Cross sparkle glint
        if (s.size > 2.0 && s.alpha > 0.6) {
          ctx.strokeStyle = s.color;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(s.x - s.size * 2, s.y);
          ctx.lineTo(s.x + s.size * 2, s.y);
          ctx.moveTo(s.x, s.y - s.size * 2);
          ctx.lineTo(s.x, s.y + s.size * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Render & update Petals
      for (const p of petals) {
        p.rotation += p.rotationSpeed;
        p.swayOffset += 0.02;
        p.x += p.speedX + Math.sin(p.swayOffset) * 0.7;
        p.y += p.speedY;

        if (p.y > height + 40) {
          p.y = -30;
          p.x = Math.random() * width;
        }
        if (p.x > width + 40) {
          p.x = -30;
        } else if (p.x < -40) {
          p.x = width + 30;
        }

        drawPetal(p);
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [flowerType, primaryColor, intensity]);

  return (
    <canvas
      ref={canvasRef}
      id="background-ambient-canvas"
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};
