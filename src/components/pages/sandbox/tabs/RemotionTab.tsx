import React, { JSX } from 'react';
import { Player } from '@remotion/player';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, Sequence, Audio } from 'remotion';
import { EmojiKitName, getEmojiImageUrl } from '../../../utils/emoji';
import { Gradients } from '../../../misc/Gradients';

export type RemotionTabProps = Record<string, never>;

const GradientMagic = {
  purpleBubblesStyle: Gradients.cssToStyleProps(
    `background-image: radial-gradient(circle at 29% 55%, hsla(329,0%,99%,0.05) 0%, hsla(329,0%,99%,0.05) 4%,transparent 4%, transparent 44%,transparent 44%, transparent 100%),radial-gradient(circle at 85% 89%, hsla(329,0%,99%,0.05) 0%, hsla(329,0%,99%,0.05) 51%,transparent 51%, transparent 52%,transparent 52%, transparent 100%),radial-gradient(circle at 6% 90%, hsla(329,0%,99%,0.05) 0%, hsla(329,0%,99%,0.05) 53%,transparent 53%, transparent 64%,transparent 64%, transparent 100%),radial-gradient(circle at 35% 75%, hsla(329,0%,99%,0.05) 0%, hsla(329,0%,99%,0.05) 6%,transparent 6%, transparent 98%,transparent 98%, transparent 100%),radial-gradient(circle at 56% 75%, hsla(329,0%,99%,0.05) 0%, hsla(329,0%,99%,0.05) 16%,transparent 16%, transparent 23%,transparent 23%, transparent 100%),radial-gradient(circle at 42% 0%, hsla(329,0%,99%,0.05) 0%, hsla(329,0%,99%,0.05) 3%,transparent 3%, transparent 26%,transparent 26%, transparent 100%),radial-gradient(circle at 29% 28%, hsla(329,0%,99%,0.05) 0%, hsla(329,0%,99%,0.05) 51%,transparent 51%, transparent 75%,transparent 75%, transparent 100%),radial-gradient(circle at 77% 21%, hsla(329,0%,99%,0.05) 0%, hsla(329,0%,99%,0.05) 35%,transparent 35%, transparent 55%,transparent 55%, transparent 100%),radial-gradient(circle at 65% 91%, hsla(329,0%,99%,0.05) 0%, hsla(329,0%,99%,0.05) 46%,transparent 46%, transparent 76%,transparent 76%, transparent 100%),linear-gradient(45deg, rgb(83, 91, 235),rgb(76, 11, 174));`,
  ),
  blueCirclesStyle: Gradients.cssToStyleProps(
    `background-image: radial-gradient(circle at 85% 1%, hsla(190,0%,93%,0.05) 0%, hsla(190,0%,93%,0.05) 96%,transparent 96%, transparent 100%),radial-gradient(circle at 14% 15%, hsla(190,0%,93%,0.05) 0%, hsla(190,0%,93%,0.05) 1%,transparent 1%, transparent 100%),radial-gradient(circle at 60% 90%, hsla(190,0%,93%,0.05) 0%, hsla(190,0%,93%,0.05) 20%,transparent 20%, transparent 100%),radial-gradient(circle at 79% 7%, hsla(190,0%,93%,0.05) 0%, hsla(190,0%,93%,0.05) 78%,transparent 78%, transparent 100%),radial-gradient(circle at 55% 65%, hsla(190,0%,93%,0.05) 0%, hsla(190,0%,93%,0.05) 52%,transparent 52%, transparent 100%),linear-gradient(135deg, rgb(37, 56, 222),rgb(96, 189, 244));`,
  ),
};

// Demo Composition - Two title screens with crossfade
const width = 3840; // 4K UHD width
const height = 2160; // 4K UHD height
const fps = 30;
const durationInFrames = fps * 6; // 6s
const TitleScreen = ({
  bgStyle,
  title,
  subtitle,
  opacity,
}: {
  bgStyle: React.CSSProperties;
  title: string;
  subtitle: string;
  opacity: number;
}) => {
  const frame = useCurrentFrame();
  // Scale relative to 4K canvas (3840x2160)
  const baseWidth = 3840;
  const baseHeight = 2160;
  const unit = Math.min(width / baseWidth, height / baseHeight);

  const lift = interpolate(frame, [0, fps], [36 * unit, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill
      style={{
        ...bgStyle,
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
        <div style={{ fontSize: 288 * unit, fontWeight: 800 }}>{title}</div>
        <div style={{ fontSize: 112 * unit, marginTop: 16 * unit, opacity: 0.9 }}>{subtitle}</div>
      </div>
    </AbsoluteFill>
  );
};

const DemoComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const crossStart = fps * 2.7;
  const crossEnd = fps * 3.3;
  const bookEmojiUrl = React.useMemo(() => getEmojiImageUrl(EmojiKitName.notoEmoji, '📖'), []);
  // Global scaling unit based on 4K canvas
  const baseWidth = 3840;
  const baseHeight = 2160;
  const unit = React.useMemo(() => Math.min(width / baseWidth, height / baseHeight), []);
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
        bgStyle={GradientMagic.blueCirclesStyle}
        title="AmpleSauce"
        subtitle="Automate research. Ship faster."
        opacity={screen1Opacity}
      />
      <TitleScreen
        bgStyle={GradientMagic.purpleBubblesStyle}
        title="Remotion Demo"
        subtitle="Two-screen crossfade inside @remotion/player"
        opacity={screen2Opacity}
      />
      {/* Emoji pop-up on second slide */}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Pop sound synced to book pop-in */}
        <Sequence from={Math.round(crossStart)} durationInFrames={fps}>
          {(() => {
            const startFrame = Math.round(crossStart);
            const local = Math.max(0, frame - startFrame);
            const popVolume = interpolate(local, [0, 3, fps], [0, 1, 0.9], {
              easing: Easing.out(Easing.cubic),
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return <Audio src={'/media/sfx/pop.wav'} volume={popVolume} />;
          })()}
        </Sequence>
        {screen2Opacity > 0 && (
          <div
            style={{
              position: 'absolute',
              right: 360 * unit,
              top: 200 * unit,
              transform: `scale(${interpolate(
                frame,
                [crossStart, crossStart + fps * 0.6, crossEnd + fps],
                [0.6, 1, 1],
                {
                  easing: Easing.out(Easing.cubic),
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                },
              )})`,
              opacity:
                interpolate(frame, [crossStart, crossStart + fps * 0.3], [0, 1], {
                  easing: Easing.out(Easing.cubic),
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }) * screen2Opacity,
              transition: 'transform 33ms linear',
            }}
          >
            <img src={bookEmojiUrl} width={Math.round(512 * unit)} height={Math.round(512 * unit)} alt="book emoji" />
          </div>
        )}
      </AbsoluteFill>
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
