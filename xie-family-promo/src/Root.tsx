import { Composition } from "remotion";
import { PromoVideo } from "./PromoVideo";

// 2min 30s at 30fps = 4500 frames
const TOTAL_FRAMES = 4500;
const FPS = 30;

export const Root: React.FC = () => {
  return (
    <Composition
      id="PromoVideo"
      component={PromoVideo}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
