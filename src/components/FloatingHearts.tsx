"use client";

import { useMemo } from "react";

const HEART_COUNT = 7;

type Heart = {
  left: string;
  size: number;
  delay: string;
  duration: string;
  drift: string;
  opacity: number;
};

function makeHearts(): Heart[] {
  return Array.from({ length: HEART_COUNT }).map((_, i) => {
    const random = (a: number, b: number) => a + Math.random() * (b - a);
    return {
      left: `${(i / HEART_COUNT) * 100 + random(-4, 4)}%`,
      size: random(10, 18),
      delay: `${random(0, 8)}s`,
      duration: `${random(8, 14)}s`,
      drift: `${random(-30, 30)}px`,
      opacity: random(0.55, 0.9),
    };
  });
}

export function FloatingHearts() {
  // Stable per render — random positions but consistent across rerenders.
  const hearts = useMemo(makeHearts, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden"
    >
      {hearts.map((h, i) => (
        <span
          key={i}
          className="float-heart absolute bottom-0 text-accent"
          style={{
            left: h.left,
            fontSize: `${h.size}px`,
            opacity: h.opacity,
            animationDelay: h.delay,
            animationDuration: h.duration,
            // CSS custom prop drives horizontal drift inside the keyframe.
            ["--drift" as string]: h.drift,
          }}
        >
          ♥
        </span>
      ))}
    </div>
  );
}
