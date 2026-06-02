import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { VILLAGE_PHOTOS } from "../assets";
import { Subtitle } from "../components/Subtitle";

export const Scene1Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background photo
  const bgPhoto = VILLAGE_PHOTOS[0];

  // Brightness: start black (0), fade in
  const brightness = interpolate(frame, [0, 60], [0, 0.65], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Title fade-in
  const titleOpacity = interpolate(frame, [120, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleScale = spring({
    frame: frame - 120,
    fps,
    config: { damping: 12, mass: 0.5 },
  });

  // Subtitle opacity
  const subOpacity = interpolate(frame, [180, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Background photo */}
      <Img
        src={bgPhoto}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: `brightness(${brightness})`,
        }}
      />

      {/* Dark gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* Center title */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
        }}
      >
        <h1
          style={{
            color: "#fff",
            fontSize: 72,
            fontFamily: '"Noto Serif SC", "SimSun", serif',
            fontWeight: 700,
            letterSpacing: 8,
            margin: 0,
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          下枫槎谢氏
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: 24,
            fontFamily: '"Noto Serif SC", "SimSun", serif',
            letterSpacing: 6,
            marginTop: 20,
            opacity: subOpacity,
          }}
        >
          绿水青山 · 望府香
        </p>
      </div>

      {/* Subtitle */}
      <Subtitle
        text="在宁海城南，有一座被青山绿水环抱的古村——下枫槎。"
        startFrame={60}
        duration={200}
      />
    </AbsoluteFill>
  );
};
