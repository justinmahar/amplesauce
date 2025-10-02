import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';

export const AmpleSauceComposition = () => {
  const { durationInFrames } = useVideoConfig();

  return (
    <Sequence from={0} durationInFrames={durationInFrames}>
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 120,
          fontFamily: 'sans-serif',
        }}
      >
        Hello, Remotion!
      </AbsoluteFill>
    </Sequence>
  );
};
