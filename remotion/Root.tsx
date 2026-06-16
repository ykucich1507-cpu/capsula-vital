import React from "react";
import { Composition } from "remotion";
import { EstanteAd } from "./EstanteAd";

export const Root: React.FC = () => {
  return (
    <Composition
      id="EstanteAd"
      component={EstanteAd}
      durationInFrames={600}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
