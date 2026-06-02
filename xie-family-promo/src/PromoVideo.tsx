import React from "react";
import { AbsoluteFill, Sequence, Audio, continueRender, delayRender } from "remotion";
import { BG_MUSIC } from "./assets";
import { Scene1Opening } from "./scenes/Scene1_Opening";
import { Scene2History } from "./scenes/Scene2_History";
import { Scene3Aerial } from "./scenes/Scene3_Aerial";
import { Scene4Life } from "./scenes/Scene4_Life";
import { Scene5People } from "./scenes/Scene5_People";
import { Scene6Digital } from "./scenes/Scene6_Digital";
import { Scene7Ending } from "./scenes/Scene7_Ending";

// Scene frame breakdown (30fps)
// ① Opening:    0-300    (0-10s)
// ② History:    300-600  (10-20s)
// ③ Aerial:     600-1050 (20-35s)
// ④ Life:       1050-1950 (35-65s)
// ⑤ People:     1950-2700 (65-90s)
// ⑥ Digital:    2700-3300 (90-110s)
// ⑦ Ending:     3300-4500 (110-150s)

const SCENE_FRAMES = {
  opening: { start: 0, end: 300 },
  history: { start: 300, end: 600 },
  aerial: { start: 600, end: 1050 },
  life: { start: 1050, end: 1950 },
  people: { start: 1950, end: 2700 },
  digital: { start: 2700, end: 3300 },
  ending: { start: 3300, end: 4500 },
};

export const PromoVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#1a1a1a" }}>
      {/* Background Music - loop throughout */}
      <Audio src={BG_MUSIC} volume={0.15} loop />

      {/* Scene ①: Opening - 0s~10s */}
      <Sequence from={SCENE_FRAMES.opening.start} durationInFrames={SCENE_FRAMES.opening.end - SCENE_FRAMES.opening.start}>
        <Scene1Opening />
      </Sequence>

      {/* Scene ②: History - 10s~20s */}
      <Sequence from={SCENE_FRAMES.history.start} durationInFrames={SCENE_FRAMES.history.end - SCENE_FRAMES.history.start}>
        <Scene2History />
      </Sequence>

      {/* Scene ③: Aerial - 20s~35s */}
      <Sequence from={SCENE_FRAMES.aerial.start} durationInFrames={SCENE_FRAMES.aerial.end - SCENE_FRAMES.aerial.start}>
        <Scene3Aerial />
      </Sequence>

      {/* Scene ④: Village Life - 35s~65s */}
      <Sequence from={SCENE_FRAMES.life.start} durationInFrames={SCENE_FRAMES.life.end - SCENE_FRAMES.life.start}>
        <Scene4Life />
      </Sequence>

      {/* Scene ⑤: People - 65s~90s */}
      <Sequence from={SCENE_FRAMES.people.start} durationInFrames={SCENE_FRAMES.people.end - SCENE_FRAMES.people.start}>
        <Scene5People />
      </Sequence>

      {/* Scene ⑥: Digital - 90s~110s */}
      <Sequence from={SCENE_FRAMES.digital.start} durationInFrames={SCENE_FRAMES.digital.end - SCENE_FRAMES.digital.start}>
        <Scene6Digital />
      </Sequence>

      {/* Scene ⑦: Ending - 110s~150s */}
      <Sequence from={SCENE_FRAMES.ending.start} durationInFrames={SCENE_FRAMES.ending.end - SCENE_FRAMES.ending.start}>
        <Scene7Ending />
      </Sequence>
    </AbsoluteFill>
  );
};
