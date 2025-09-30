import md5 from 'md5';

export const createGravatarUrl = (
  email: string | undefined | null,
  gravatarTheme: GravatarTheme = 'identicon',
): string => {
  if (typeof email === 'string') {
    try {
      const hash = md5(email.trim().toLowerCase());
      return `https://www.gravatar.com/avatar/${hash}${
        gravatarTheme && gravatarTheme !== 'none' ? `?d=${gravatarTheme}` : ''
      }`;
    } catch (e) {
      console.error(e);
    }
  }
  return missingGravatar;
};

export const missingGravatar = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp';
export type GravatarTheme =
  /** Do not use a theme. Will default to G logo when the user hasn't uploaded an image yet. */
  | 'none'
  /** Do not load any image if none is associated with the email hash, instead return an HTTP 404 (File Not Found) response. */
  | '404'
  /** (mystery-person) a simple, cartoon-style silhouetted outline of a person (does not vary by email hash). */
  | 'mp'
  /** A geometric pattern based on an email hash. */
  | 'identicon'
  /** A generated 'monster' with different colors, faces, etc. */
  | 'monsterid'
  /** Generated faces with differing features and backgrounds. */
  | 'wavatar'
  /** Awesome generated, 8-bit arcade-style pixelated faces. */
  | 'retro'
  /** A generated robot with different colors, faces, etc. */
  | 'robohash'
  /** A transparent PNG image. */
  | 'blank';
