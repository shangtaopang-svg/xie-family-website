import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface SubtitleProps {
  text: string;
  startFrame: number;
  duration: number;
  delay?: number;
}

export const Subtitle: React.FC<SubtitleProps> = ({ text, startFrame, duration, delay = 20 }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  const opacity = interpolate(localFrame, [0, delay, duration - delay, duration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const y = interpolate(localFrame, [0, delay], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (localFrame < 0 || localFrame > duration) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 80,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <div
        style={{
          display: "inline-block",
          background: "rgba(0,0,0,0.6)",
          padding: "12px 32px",
          borderRadius: 8,
          backdropFilter: "blur(4px)",
        }}
      >
        <span
          style={{
            color: "#fff",
            fontSize: 28,
            fontFamily: '"Noto Serif SC", "SimSun", serif',
            letterSpacing: 2,
            lineHeight: 1.6,
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};
