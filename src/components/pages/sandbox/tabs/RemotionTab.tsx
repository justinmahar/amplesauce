import React, { JSX } from 'react';
import { Form } from 'react-bootstrap';
import { Player } from '@remotion/player';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, Sequence, Audio, Video } from 'remotion';
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
const durationInFrames = fps * 9; // total duration (3s video + 6s titles)
// Google Fonts configuration (easily configurable)
const DEFAULT_TITLE_FONT = 'Inter';
const DEFAULT_SUBTITLE_FONT = 'Outfit';
const COMMON_GOOGLE_FONTS = [
  'Inter',
  'Outfit',
  'Poppins',
  'Montserrat',
  'Roboto',
  'Open Sans',
  'Lato',
  'Nunito',
  'Source Sans 3',
  'Work Sans',
  'Playfair Display',
  'Merriweather',
];

const ensureGoogleFontsLoaded = (families: string[]): void => {
  if (typeof document === 'undefined') {
    return;
  }
  const id = `google-fonts-${families.join('-').toLowerCase().replace(/\s+/g, '-')}`;
  if (document.getElementById(id)) {
    return;
  }
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  // Request bold/regular weights commonly used
  const params = families.map((f) => `family=${encodeURIComponent(f)}:wght@300;400;600;700;800;900`).join('&');
  link.href = `https://fonts.googleapis.com/css2?${params}&display=swap`;
  document.head.appendChild(link);
};

const TitleScreen = ({
  bgStyle,
  title,
  subtitle,
  opacity,
  titleFont,
  subtitleFont,
}: {
  bgStyle: React.CSSProperties;
  title: string;
  subtitle: string;
  opacity: number;
  titleFont: string;
  subtitleFont: string;
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
      }}
    >
      <div style={{ textAlign: 'center', transform: `translateY(${lift}px)` }}>
        <div
          style={{
            fontFamily: `${titleFont}, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Noto Sans, "Apple Color Emoji", "Segoe UI Emoji"`,
            fontSize: 288 * unit,
            fontWeight: 800,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: `${subtitleFont}, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Noto Sans, "Apple Color Emoji", "Segoe UI Emoji"`,
            fontSize: 112 * unit,
            marginTop: 16 * unit,
            opacity: 0.9,
            fontWeight: 600,
          }}
        >
          {subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};

type DemoProps = { titleFont: string; subtitleFont: string; emojiChar: string };

const DemoComposition: React.FC<DemoProps> = ({ titleFont, subtitleFont, emojiChar }) => {
  const frame = useCurrentFrame();
  // Intro video duration: 3 seconds
  const videoDurationFrames = fps * 3;
  // Crossfade between screens, offset to happen after the intro video
  const crossStart = videoDurationFrames + fps * 2.7;
  const crossEnd = videoDurationFrames + fps * 3.3;
  const bookEmojiUrl = React.useMemo(() => getEmojiImageUrl(EmojiKitName.notoEmoji, emojiChar || '📖'), [emojiChar]);
  // Global scaling unit based on 4K canvas
  const baseWidth = 3840;
  const baseHeight = 2160;
  const unit = React.useMemo(() => Math.min(width / baseWidth, height / baseHeight), []);

  // Load Google Fonts for the selected families
  React.useEffect(() => {
    ensureGoogleFontsLoaded([titleFont, subtitleFont]);
  }, [titleFont, subtitleFont]);
  // Title 1 fades in overlapping with the end of the intro video, then later fades out at crossStart→crossEnd
  const title1Visible =
    frame < crossStart
      ? 1
      : frame > crossEnd
        ? 0
        : interpolate(frame, [crossStart, crossEnd], [1, 0], {
            easing: Easing.inOut(Easing.cubic),
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
  const overlapFrames = Math.round(fps * 0.6);
  const title1FadeIn = interpolate(frame, [videoDurationFrames - overlapFrames, videoDurationFrames], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const screen1Opacity = title1Visible * title1FadeIn;
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
      {/* Intro video, 3 seconds, then fades out */}
      <Sequence from={0} durationInFrames={videoDurationFrames}>
        <AbsoluteFill
          style={{
            opacity: interpolate(frame, [videoDurationFrames - Math.round(fps * 0.5), videoDurationFrames], [1, 0], {
              easing: Easing.inOut(Easing.cubic),
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          <Video
            src={
              'https://firebasestorage.googleapis.com/v0/b/ample-sauce.firebasestorage.app/o/uploads%2Fsandbox%2Fvideos%2Fdark-ocean-surface-ocean-looped-animation-2025-08-29-10-10-45-utc.mov?alt=media&token=fc4dbbee-301c-47ac-a194-f739382a2ba9'
            }
            muted
            style={{ width: '100%', height: '100%' }}
          />
        </AbsoluteFill>
      </Sequence>
      <TitleScreen
        bgStyle={GradientMagic.blueCirclesStyle}
        title="AmpleSauce"
        subtitle="Automate research. Ship faster."
        opacity={screen1Opacity}
        titleFont={titleFont}
        subtitleFont={subtitleFont}
      />
      <TitleScreen
        bgStyle={GradientMagic.purpleBubblesStyle}
        title="Remotion Demo"
        subtitle="Two-screen crossfade inside @remotion/player"
        opacity={screen2Opacity}
        titleFont={titleFont}
        subtitleFont={subtitleFont}
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
  const [titleFont, setTitleFont] = React.useState<string>(DEFAULT_TITLE_FONT);
  const [subtitleFont, setSubtitleFont] = React.useState<string>(DEFAULT_SUBTITLE_FONT);
  const [emojiChar, setEmojiChar] = React.useState<string>('📖');
  return (
    <div>
      <h2 className="mb-3">Remotion</h2>
      <div className="mb-3 d-flex gap-3 flex-wrap align-items-end">
        <Form.Group controlId="titleFontSelect">
          <Form.Label className="mb-1">Title Font</Form.Label>
          <Form.Select value={titleFont} onChange={(e) => setTitleFont(e.target.value)} style={{ minWidth: 220 }}>
            {COMMON_GOOGLE_FONTS.map((f) => (
              <option key={`title-${f}`} value={f}>
                {f}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group controlId="subtitleFontSelect">
          <Form.Label className="mb-1">Subtitle Font</Form.Label>
          <Form.Select value={subtitleFont} onChange={(e) => setSubtitleFont(e.target.value)} style={{ minWidth: 220 }}>
            {COMMON_GOOGLE_FONTS.map((f) => (
              <option key={`subtitle-${f}`} value={f}>
                {f}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group controlId="emojiCharInput">
          <Form.Label className="mb-1">Emoji</Form.Label>
          <Form.Control
            value={emojiChar}
            onChange={(e) => setEmojiChar(e.target.value)}
            placeholder="Emoji (e.g., 📖)"
            style={{ width: 100 }}
          />
        </Form.Group>
      </div>
      <Player
        component={DemoComposition}
        inputProps={{ titleFont, subtitleFont, emojiChar }}
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
