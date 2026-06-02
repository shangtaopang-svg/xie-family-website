import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { HALL_PHOTOS } from "../assets";
import { Subtitle } from "../components/Subtitle";

export const Scene5People: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneDuration = 750; // 25s (65-90s overall)

  // Hall photos rapid slideshow - 1.2s per photo (36 frames)
  const PHOTOS_PER_SEC = 1.2;
  const PHOTO_FRAMES = 36;
  const photoIndex = Math.min(Math.floor(frame / PHOTO_FRAMES), HALL_PHOTOS.length - 1);
  const localFrame = frame % PHOTO_FRAMES;

  // Zoom in effect on each photo
  const scale = interpolate(localFrame, [0, PHOTO_FRAMES], [1, 1.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle pan
  const panX = interpolate(localFrame, [0, PHOTO_FRAMES], [0, 8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* Rapid photo slideshow */}
      {HALL_PHOTOS.slice(0, 15).map((photo, idx) => (
        <div
          key={idx}
          style={{
            position: "absolute",
            inset: 0,
            opacity: idx === photoIndex ? 1 : 0,
          }}
        >
          <Img
            src={photo}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${idx === photoIndex ? scale : 1}) translateX(${idx === photoIndex ? panX : 0}px)`,
              filter: "brightness(0.55) saturate(1.1)",
            }}
          />
        </div>
      ))}

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* Subtitles */}
      <Subtitle
        text="敦睦堂内，春秋二祭，少长咸集。"
        startFrame={0}
        duration={350}
      />
      <Subtitle
        text="乌衣世泽，代代相传。"
        startFrame={350}
        duration={400}
      />
    </AbsoluteFill>
  );
};
