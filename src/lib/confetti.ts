"use client";

import confetti from "canvas-confetti";

const COLORS = ["#ec7c8b", "#f4a3b0", "#fbd0d9", "#f3c969", "#fff1ea"];
const HEART_COLORS = ["#ec4899", "#f472b6", "#fb7185", "#f9a8d4", "#fce7f3"];

// canvas-confetti shapes: register a heart-shaped path once.
let heartShape: confetti.Shape | null = null;
function getHeartShape() {
  if (heartShape) return heartShape;
  heartShape = confetti.shapeFromPath({
    path: "M0,-5 C-2,-7 -5,-7 -5,-3 C-5,1 0,5 0,7 C0,5 5,1 5,-3 C5,-7 2,-7 0,-5 Z",
  });
  return heartShape;
}

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

/**
 * Heart-rain — falls from the top across the full width for ~3 seconds.
 * Used by the Knight's "anh nhớ em" ping → Princess's Realtime sub.
 */
export function rainHearts(durationMs = 3000) {
  const end = Date.now() + durationMs;
  const shape = getHeartShape();

  const tick = () => {
    if (Date.now() > end) return;
    confetti({
      particleCount: 6,
      startVelocity: 20,
      spread: 80,
      ticks: 240,
      gravity: 0.55,
      origin: { x: Math.random(), y: -0.05 },
      colors: HEART_COLORS,
      shapes: [shape],
      scalar: 1.4,
      drift: (Math.random() - 0.5) * 0.6,
    });
    requestAnimationFrame(tick);
  };
  tick();
}
