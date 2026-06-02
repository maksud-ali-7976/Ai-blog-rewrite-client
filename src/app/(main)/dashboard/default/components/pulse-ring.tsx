"use client";


export default function PulseRing({ color }: { color: string }) {
  return (
    <span className="relative flex h-3 w-3">
      <span
        className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
        style={{ backgroundColor: `hsl(${color} / 0.4)` }}
      />
      <span
        className="relative inline-flex h-3 w-3 rounded-full"
        style={{ backgroundColor: `hsl(${color})` }}
      />
    </span>
  );
}
