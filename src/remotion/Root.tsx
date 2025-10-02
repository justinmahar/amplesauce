import React from 'react';
import { Composition } from 'remotion';
import { AmpleSauceComposition } from './AmpleSauceComposition';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="greeting"
        component={AmpleSauceComposition}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ title: 'Untitled' }}
      />
    </>
  );
};
