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
        width={3840}
        height={2160}
        defaultProps={{ title: 'Untitled' }}
      />
    </>
  );
};
