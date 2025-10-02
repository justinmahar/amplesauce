import React from 'react';
import { Composition } from 'remotion';

export const MyComposition = () => {
  const Hello = () => {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 120,
          fontFamily: 'sans-serif',
        }}
      >
        Hello, Remotion!
      </div>
    );
  };

  return (
    <Composition
      id="Hello"
      component={Hello}
      durationInFrames={150} // 5s at 30fps
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
