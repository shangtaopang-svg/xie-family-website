import React, { useMemo } from "react";
import { AbsoluteFill, Img, useCurrentFrame, interpolate, spring, useVideoConfig, interpolateColors } from "remotion";
import { VILLAGE_PHOTOS, TEMPLE_PHOTOS } from "../assets";
import { Subtitle } from "../components/Subtitle";

export const Scene2History: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneDuration = 300; // 10s

  // Crossfade between temple photos
  const photoIndex = frame < 100 ? 0 : frame < 200 ? 1 : 2;

  const opacity = interpolate(frame % 100, [80, 100], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pan/zoom effect on image
  const scale = interpolate(frame % 100, [0, 100], [1, 1.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#1a1410" }}>
      {/* Scrolling temple photos with Ken Burns effect */}
      <div style={{ position: "absolute", inset: 0 }}>
        {[0, 1, 2].map((idx) => (
          <div
            key={idx}
            style={{
              position: "absolute",
              inset: 0,
              opacity: photoIndex === idx ? 1 : 0,
              transition: "opacity 1.5s",
            }}
          >
            <Img
              src={TEMPLE_PHOTOS[idx]}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `scale(${photoIndex === idx ? scale : 1})`,
                filter: "brightness(0.5)",
              }}
            />
          </div>
        ))}
      </div>

      {/* Overlay gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Subtitle 1 */}
      <Subtitle
        text="自北宋宣和年间，文杲公始居岩下，至今已传三十六世，近九百载。"
        startFrame={0}
        duration={150}
      />

      {/* Subtitle 2 */}
      <Subtitle
        text="明隆庆六年，乾公彬公迁于双枫古槎之下，开枝散叶，生生不息。"
        startFrame={150}
        duration={150}
      />
    </AbsoluteFill>
  );
};
