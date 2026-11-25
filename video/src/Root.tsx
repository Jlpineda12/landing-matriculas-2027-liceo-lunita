import { loadFont } from "@remotion/fonts";
import { Composition, staticFile } from "remotion";
import { MatriculasVideo } from "./Video";
import { TOTAL } from "./theme";

loadFont({ family: "Nunito", url: staticFile("fonts/nunito-latin-wght-normal.woff2"), weight: "200 1000" });

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Landscape" component={MatriculasVideo} durationInFrames={TOTAL} fps={30} width={1920} height={1080} />
    <Composition id="Vertical" component={MatriculasVideo} durationInFrames={TOTAL} fps={30} width={1080} height={1920} />
  </>
);
