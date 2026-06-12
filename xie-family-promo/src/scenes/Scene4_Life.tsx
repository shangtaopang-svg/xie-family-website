import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, interpolate } from "remotion";
import { VILLAGE_PHOTOS, TEMPLE_PHOTOS } from "../assets";
import { Subtitle } from "../components/Subtitle";

export const Scene4Life: React.FC = () => {
  const frame = useCurrentFrame();
  const sceneDuration = 900; // 30s (35-65s overall)

  // Cycle through available photos
  const allPhotos = [...VILLAGE_PHOTOS, ...TEMPLE_PHOTOS];
  const PHOTO_INTERVAL = 90; // 3s per photo
  const photoIndex = Math.floor(frame / PHOTO_INTERVAL) % allPhotos.length;
  const segFrame = frame % PHOTO_INTERVAL;

  // Ken Burns slow zoom
  const scale = interpolate(segFrame, [0, PHOTO_INTERVAL], [1, 1.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle pan
  const panX = interpolate(segFrame, [0, PHOTO_INTERVAL], [0, 10], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Crossfade
  const nextOpacity = interpolate(segFrame, [PHOTO_INTERVAL - 15, PHOTO_INTERVAL], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#1a1a1a" }}>
      {/* Current photo */}
      <div style={{ position: "absolute", inset: 0 }}>
        <Img
          src={allPhotos[photoIndex]}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale}) translateX(${panX}px)`,
            filter: "brightness(0.6)",
          }}
        />
      </div>

      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      {/* Subtitle */}
      <Subtitle
        text="绿水青山间，望府香茶香袅袅，古树参天，诉说着岁月的故事。"
        startFrame={0}
        duration={900}
      />
    </AbsoluteFill>
  );
};
