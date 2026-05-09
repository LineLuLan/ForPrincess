"use client";

import confetti from "canvas-confetti";
import { PING_ICONS, type PingIcon } from "@/lib/ping-icons";

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

const shapeCache = new Map<PingIcon, confetti.Shape>();
function getIconShape(icon: PingIcon): confetti.Shape {
  let s = shapeCache.get(icon);
  if (!s) {
    s = confetti.shapeFromText({ text: PING_ICONS[icon].emoji, scalar: 2 });
    shapeCache.set(icon, s);
  }
  return s;
}

/**
 * Icon-rain — falls from the top across the full width for ~3 seconds.
 * Used by ping notifications: each ping carries an icon type, the receiver
 * rains that emoji.
 */
export function rainIcons(icon: PingIcon = "heart", durationMs = 3000) {
  const end = Date.now() + durationMs;
  const shape = getIconShape(icon);

  const tick = () => {
    if (Date.now() > end) return;
    confetti({
      particleCount: 6,
      startVelocity: 20,
      spread: 80,
      ticks: 240,
      gravity: 0.55,
      origin: { x: Math.random(), y: -0.05 },
      shapes: [shape],
      scalar: 2,
      drift: (Math.random() - 0.5) * 0.6,
    });
    requestAnimationFrame(tick);
  };
  tick();
}

export const rainHearts = (durationMs?: number) => rainIcons("heart", durationMs);
