"use client";

import confetti from "canvas-confetti";

const COLORS = ["#ec7c8b", "#f4a3b0", "#fbd0d9", "#f3c969", "#fff1ea"];

export function celebrate() {
  // Two staggered bursts so it feels alive without being noisy.
  confetti({
    particleCount: 80,
    spread: 70,
    startVelocity: 38,
    origin: { x: 0.5, y: 0.6 },
    colors: COLORS,
    scalar: 0.9,
    ticks: 200,
  });
  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      origin: { x: 0.1, y: 0.7 },
      colors: COLORS,
    });
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 0.9, y: 0.7 },
      colors: COLORS,
    });
  }, 200);
}
