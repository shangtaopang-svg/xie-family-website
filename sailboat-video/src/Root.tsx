import { Composition } from "remotion";
import { SailboatUniverse } from "./SailboatUniverse";

export const Root = () => {
  return (
    <Composition
      id="SailboatUniverse"
      component={SailboatUniverse}
      durationInFrames={450}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
