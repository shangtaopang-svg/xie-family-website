import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, interpolate, staticFile } from "remotion";
import { VILLAGE_PHOTOS } from "../assets";
import { Subtitle } from "../components/Subtitle";

export const Scene3Aerial: React.FC = () => {
  const frame = useCurrentFrame();

  // Crossfade between scenic photos with Ken Burns zoom
  const photoIndex = Math.floor(frame / 150) % 3;
  const segFrame = frame % 150;

  const scale = interpolate(segFrame, [0, 150], [1, 1.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(segFrame, [130, 150], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Photos for aerial-style views
  const aerialPhotos = [
    VILLAGE_PHOTOS[3], // 37.jpg
    VILLAGE_PHOTOS[9], // W02023...
    VILLAGE_PHOTOS[11], // W02023...
  ];

  return (
    <AbsoluteFill style={{ background: "#1a1a1a" }}>
      {/* Photo display */}
      <div style={{ position: "absolute", inset: 0 }}>
        <Img
          src={aerialPhotos[photoIndex]}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale})`,
            filter: "brightness(0.65) saturate(1.05)",
          }}
        />
      </div>

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* Subtitle */}
      <Subtitle
        text="青山环绕，绿水长流。望府香茶，香飘百里。"
        startFrame={30}
        duration={420}
      />
    </AbsoluteFill>
  );
};
