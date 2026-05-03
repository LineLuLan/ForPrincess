type EmptyHeartsProps = {
  className?: string;
};

export function EmptyHearts({ className }: EmptyHeartsProps) {
  return (
    <svg
      viewBox="0 0 120 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <ellipse cx="60" cy="92" rx="38" ry="3" fill="currentColor" opacity="0.08" />

      <g opacity="0.55">
        <path
          d="M28 32c-3-3-3-8 0-11s8-3 11 0l1 1 1-1c3-3 8-3 11 0s3 8 0 11L40 44z"
          fill="currentColor"
          opacity="0.35"
        />
      </g>
      <g opacity="0.6">
        <path
          d="M82 22c-3-3-3-8 0-11s8-3 11 0l1 1 1-1c3-3 8-3 11 0s3 8 0 11L94 34z"
          fill="currentColor"
          opacity="0.35"
        />
      </g>

      <g>
        <path
          d="M46 38c-7-6-7-17 0-23 7-6 17-5 23 2l1 1 1-1c6-7 16-8 23-2 7 6 7 17 0 23L70 80z"
          fill="currentColor"
          opacity="0.85"
        />
        <circle cx="58" cy="40" r="2" fill="white" opacity="0.7" />
        <path
          d="M55 49c2 2 5 2 7 0"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.8"
          fill="none"
        />
      </g>

      <g opacity="0.7">
        <circle cx="22" cy="58" r="1.4" fill="currentColor" />
        <circle cx="100" cy="62" r="1.4" fill="currentColor" />
        <circle cx="14" cy="80" r="1" fill="currentColor" />
        <circle cx="106" cy="82" r="1" fill="currentColor" />
      </g>
    </svg>
  );
}
