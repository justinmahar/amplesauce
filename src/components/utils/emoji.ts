// Emoji utilities: sources and helpers

export type EmojiSource = {
  format: 'png';
  url?: string; // Base URL that requires appending <code>.png
  builder?: (code: string) => string; // Function that returns a full URL given a code like '1f600'
};

export type EmojiSourceFactory = (size?: number, version?: string) => EmojiSource;

export const emojis: {
  twemoji: EmojiSourceFactory;
  joyPixels: EmojiSourceFactory;
  openMojiColor: EmojiSourceFactory;
  openMojiBlack: EmojiSourceFactory;
  notoEmoji: EmojiSourceFactory;
} = {
  // Emoji source GitHub project: https://github.com/twitter/twemoji
  // size default 72; version default 14.0.2
  twemoji: (size: number = 72, version: string = '14.0.2') => ({
    format: 'png',
    url: `https://cdnjs.cloudflare.com/ajax/libs/twemoji/${version}/${size}x${size}/`,
  }),

  // Emoji source GitHub project: https://github.com/joypixels/emoji-toolkit
  // size 32 or 64 (default 64); version default 9.0
  joyPixels: (size: number = 64, version: string = '9.0') => ({
    format: 'png',
    url: `https://cdn.jsdelivr.net/joypixels/assets/${version}/png/unicode/${size}/`,
  }),

  // Emoji source GitHub project: https://github.com/hfg-gmuend/openmoji
  // size 72 or 618 (default 618); version default 15.1.0
  openMojiColor: (size: number = 618, version: string = '15.1.0') => ({
    format: 'png',
    builder: (code: string) =>
      `https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji@${version}/color/${size}x${size}/${code.toUpperCase()}.png`,
  }),

  // Emoji source GitHub project: https://github.com/hfg-gmuend/openmoji
  // size 72 or 618 (default 618); version default 15.1.0
  openMojiBlack: (size: number = 618, version: string = '15.1.0') => ({
    format: 'png',
    builder: (code: string) =>
      `https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji@${version}/black/${size}x${size}/${code.toUpperCase()}.png`,
  }),

  // Emoji source GitHub project: https://github.com/googlefonts/noto-emoji
  // size 32, 72, 128, or 512 (default 512); version default v2.047
  notoEmoji: (size: number = 512, version: string = 'v2.047') => ({
    format: 'png',
    builder: (code: string) =>
      `https://cdn.jsdelivr.net/gh/googlefonts/noto-emoji@${version}/png/${size}/emoji_u${code.split('-').join('_')}.png`,
  }),
};

// Convert an emoji to its hyphen-separated lower-case codepoint string, e.g. '😀' -> '1f600'
// Supports compound emoji with zero-width joiners (ZWJ), e.g. '👨‍💻' -> '1f468-200d-1f4bb'
export const getEmojiCode = (emoji: string): string => {
  const codes: string[] = [];
  for (let i = 0; i < emoji.length; ) {
    const cp = emoji.codePointAt(i);
    if (typeof cp === 'number') {
      codes.push(cp.toString(16));
      i += cp > 0xffff ? 2 : 1;
    } else {
      i += 1;
    }
  }
  return codes.join('-');
};

export enum EmojiKitName {
  twemoji = 'twemoji',
  joyPixels = 'joyPixels',
  openMojiColor = 'openMojiColor',
  openMojiBlack = 'openMojiBlack',
  notoEmoji = 'notoEmoji',
}

// Build a full image URL for an emoji given a kit, size, and version
export const getEmojiImageUrl = (
  kit: EmojiKitName,
  emoji: string,
  options?: { size?: number; version?: string },
): string => {
  const code = getEmojiCode(emoji);
  const size = options?.size;
  const version = options?.version;
  const src = emojis[kit](size, version);
  if (src.builder) {
    return src.builder(code);
  }
  const base = src.url ?? '';
  return `${base}${code}.png`;
};
