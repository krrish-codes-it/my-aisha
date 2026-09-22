/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

interface FloatingButterfliesProps {
  count?: number;
  color?: string;
  triggerKey?: number | string;
}

export const FloatingButterflies: React.FC<FloatingButterfliesProps> = ({
  count = 3,
  color = '#f472b6',
  triggerKey = 0,
}) => {
  const butterflies = Array.from({ length: count }, (_, i) => ({
    id: `bf-${triggerKey}-${i}`,
    startY: 20 + Math.random() * 60, // percentage from top
    scale: 0.65 + Math.random() * 0.55,
    delay: i * 0.45,
    duration: 5.5 + Math.random() * 2.5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {butterflies.map((b) => (
        <motion.div
          key={b.id}
          initial={{
            x: '-10vw',
            y: `${b.startY}vh`,
            opacity: 0,
            scale: b.scale,
          }}
          animate={{
            x: '110vw',
            y: [
              `${b.startY}vh`,
              `${b.startY - 12}vh`,
              `${b.startY + 8}vh`,
              `${b.startY - 15}vh`,
            ],
            opacity: [0, 0.95, 0.95, 0],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            ease: 'easeInOut',
          }}
          className="absolute"
        >
          {/* Butterfly SVG with flapping wing animation */}
          <div className="relative flex items-center justify-center filter drop-shadow-[0_2px_10px_rgba(251,191,36,0.6)]">
            {/* Left Wing */}
            <motion.div
              animate={{
                rotateY: [0, 68, 0],
                rotateZ: [-6, 6, -6],
              }}
              transition={{
                duration: 0.28,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ transformOrigin: 'right center' }}
            >
              <svg width="28" height="34" viewBox="0 0 28 34" fill="none">
                <path
                  d="M26 17C26 17 21 4 9 2C0.5 0.5 -1.5 11 3.5 16C7 19.5 25 17 25 17Z"
                  fill={color}
                  fillOpacity="0.85"
                />
                <path
                  d="M26 17C26 17 20 28 8 32C0.5 34 -1 25 3 20C6.5 16 26 17 26 17Z"
                  fill="#fbcfe8"
                  fillOpacity="0.75"
                />
                <path
                  d="M10 6C15 8 18 13 18 13"
                  stroke="#ffffff"
                  strokeWidth="0.75"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>

            {/* Body */}
            <div className="w-1.5 h-6 bg-amber-200 rounded-full shadow-[0_0_6px_#fef08a] z-10 mx-[-1px] relative">
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-100 rounded-full" />
              {/* Antennae */}
              <div className="absolute -top-3 -left-1 w-2 h-2 border-t border-l border-amber-200 rounded-tl-full" />
              <div className="absolute -top-3 -right-1 w-2 h-2 border-t border-r border-amber-200 rounded-tr-full" />
            </div>

            {/* Right Wing */}
            <motion.div
              animate={{
                rotateY: [0, -68, 0],
                rotateZ: [6, -6, 6],
              }}
              transition={{
                duration: 0.28,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ transformOrigin: 'left center' }}
            >
              <svg width="28" height="34" viewBox="0 0 28 34" fill="none">
                <path
                  d="M2 17C2 17 7 4 19 2C27.5 0.5 29.5 11 24.5 16C21 19.5 3 17 3 17Z"
                  fill={color}
                  fillOpacity="0.85"
                />
                <path
                  d="M2 17C2 17 8 28 20 32C27.5 34 29 25 25 20C21.5 16 2 17 2 17Z"
                  fill="#fbcfe8"
                  fillOpacity="0.75"
                />
                <path
                  d="M18 6C13 8 10 13 10 13"
                  stroke="#ffffff"
                  strokeWidth="0.75"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
