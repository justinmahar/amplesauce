import React from 'react';
import { Composition } from 'remotion';
import { AmpleSauceSequence } from './AmpleSauceSequence';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Hello"
        component={AmpleSauceSequence}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
