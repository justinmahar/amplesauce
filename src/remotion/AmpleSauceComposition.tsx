import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig, useCurrentFrame, interpolate } from 'remotion';

export type AmpleSauceCompositionProps = {
  title: string;
};

export const AmpleSauceComposition: React.FC<AmpleSauceCompositionProps> = ({ title }: AmpleSauceCompositionProps) => {
  const { durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15, durationInFrames - 15, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const y = interpolate(frame, [0, 30], [40, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <Sequence from={0} durationInFrames={durationInFrames}>
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 120,
          fontFamily: 'sans-serif',
          background: 'linear-gradient(135deg, #2538de, #60bdf4)',
        }}
      >
        <div style={{ color: '#fff', transform: `translateY(${y}px)`, opacity }}>{title}</div>
      </AbsoluteFill>
    </Sequence>
  );
};
