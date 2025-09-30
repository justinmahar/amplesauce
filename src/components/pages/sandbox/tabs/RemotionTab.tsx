import React, { JSX } from 'react';
import { Player } from '@remotion/player';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';

export type RemotionTabProps = Record<string, never>;

// Demo Composition - Two title screens with crossfade
const width = 640;
const height = 360;
const fps = 30;
const durationInFrames = fps * 6; // 6s
const TitleScreen = ({
  bg,
  title,
  subtitle,
  opacity,
}: {
  bg: string;
  title: string;
  subtitle: string;
  opacity: number;
}) => {
  const frame = useCurrentFrame();
  const lift = interpolate(frame, [0, fps], [24, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill
      style={{
        background: bg,
        color: '#fff',
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Noto Sans, "Apple Color Emoji", "Segoe UI Emoji"',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
      }}
    >
      <div style={{ textAlign: 'center', transform: `translateY(${lift}px)` }}>
        <div style={{ fontSize: 44, fontWeight: 800 }}>{title}</div>
        <div style={{ fontSize: 18, marginTop: 10, opacity: 0.9 }}>{subtitle}</div>
      </div>
    </AbsoluteFill>
  );
};

const DemoComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const crossStart = fps * 2.7;
  const crossEnd = fps * 3.3;
  const screen1Opacity =
    frame < crossStart
      ? 1
      : frame > crossEnd
        ? 0
        : interpolate(frame, [crossStart, crossEnd], [1, 0], {
            easing: Easing.inOut(Easing.cubic),
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
  const screen2Opacity =
    frame < crossStart
      ? 0
      : frame > crossEnd
        ? 1
        : interpolate(frame, [crossStart, crossEnd], [0, 1], {
            easing: Easing.inOut(Easing.cubic),
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

  return (
    <AbsoluteFill>
      <TitleScreen
        bg="linear-gradient(135deg, #0ea5e9, #7c3aed)"
        title="AmpleSauce"
        subtitle="Automate research. Ship faster."
        opacity={screen1Opacity}
      />
      <TitleScreen
        bg="linear-gradient(135deg, #10b981, #ef4444)"
        title="Remotion Demo"
        subtitle="Two-screen crossfade inside @remotion/player"
        opacity={screen2Opacity}
      />
    </AbsoluteFill>
  );
};

export const RemotionTab = (_props: RemotionTabProps): JSX.Element => {
  return (
    <div>
      <h2 className="mb-3">Remotion</h2>
      <Player
        component={DemoComposition}
        durationInFrames={durationInFrames}
        compositionWidth={width}
        compositionHeight={height}
        fps={fps}
        controls
        style={{ width: '100%', maxWidth: 800 }}
      />
    </div>
  );
};
