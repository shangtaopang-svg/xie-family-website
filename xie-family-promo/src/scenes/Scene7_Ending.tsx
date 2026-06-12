import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { VILLAGE_PHOTOS } from "../assets";
import { Subtitle } from "../components/Subtitle";

export const Scene7Ending: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneDuration = 1200; // 40s (110-150s overall)

  // Sunset photo with slow zoom out
  const scale = interpolate(frame, [0, 1200], [1.15, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Vignette darkening
  const vignette = interpolate(frame, [800, 1200], [0, 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Title fade in
  const titleOpacity = interpolate(frame, [100, 200], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Tagline
  const taglineOpacity = interpolate(frame, [200, 300], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Call to action
  const ctaOpacity = interpolate(frame, [800, 900], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Final fade out
  const finalFade = interpolate(frame, [1100, 1200], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Background image with slow zoom */}
      <Img
        src={VILLAGE_PHOTOS[VILLAGE_PHOTOS.length - 1]}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
          filter: `brightness(${0.5 - vignette}) saturate(1.1)`,
        }}
      />

      {/* Dark overlay for text */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,${0.4 + vignette}) 100%)`,
        }}
      />

      {/* Center content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: finalFade,
        }}
      >
        {/* Title */}
        <h1
          style={{
            color: "#fff",
            fontSize: 56,
            fontFamily: '"Noto Serif SC", "SimSun", serif',
            fontWeight: 700,
            letterSpacing: 6,
            margin: 0,
            opacity: titleOpacity,
            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          乌衣世泽 · 宝树家声
        </h1>

        {/* Tagline */}
        <p
          style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: 28,
            fontFamily: '"Noto Serif SC", "SimSun", serif',
            letterSpacing: 4,
            marginTop: 24,
            opacity: taglineOpacity,
          }}
        >
          绿水青山望府香
        </p>

        {/* Call to action */}
        <div
          style={{
            marginTop: 60,
            opacity: ctaOpacity,
          }}
        >
          <p
            style={{
              color: "#fb923c",
              fontSize: 20,
              fontFamily: '"Noto Serif SC", "SimSun", serif',
              letterSpacing: 3,
              borderTop: "1px solid rgba(251,146,60,0.3)",
              paddingTop: 20,
            }}
          >
            下枫槎 · 等你回家
          </p>
        </div>
      </div>

      {/* Subtitle */}
      <Subtitle
        text="乌衣世泽长，宝树家声远。下枫槎，等你回家。"
        startFrame={50}
        duration={1100}
      />
    </AbsoluteFill>
  );
};
