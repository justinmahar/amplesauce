import FormData from 'form-data';
import * as KeyCodeJS from 'keycode-js';
import { v4 as uuidv4 } from 'uuid';

export const submitFormData = (
  formActionUrl: string,
  formData: FormData | string,
  fetchRequestInit: RequestInit = {},
): Promise<any> => {
  const DEFAULT_METHOD = 'POST';
  return new Promise(
    (resolve: (value?: any | PromiseLike<any> | undefined) => void, reject: (reason?: any) => void) => {
      const mergedFetchRequestInit: any = {
        body: formData,
        method: DEFAULT_METHOD,
        ...fetchRequestInit,
      };

      fetch(formActionUrl, mergedFetchRequestInit)
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    },
  );
};

export const submitForm = (
  formActionUrl: string,
  form: HTMLFormElement,
  fetchRequestInit: RequestInit = {},
): Promise<any> => {
  return submitFormData(formActionUrl, new FormData(form), fetchRequestInit);
};

/**
 * Trims off leading and trailing slashes (both / and \\) from the path.
 * For example, `"/pages/about/"` will be returned as `"pages/about"`.
 * This function can be used to ensure the correct number of slashes are present
 * when building URLs.
 *
 * If no slashes are present at the beginning or end of the path, the path is returned as is.
 * @param path The path string that may start or end with slashes.
 * @returns The path without leading or trailing slashes.
 */
export function trimSlashes(path: string): string {
  if (!!path && path.length > 0) {
    path = path.startsWith('/') || path.startsWith('\\') ? path.slice(1) : path;
    path = path.endsWith('/') || path.endsWith('\\') ? path.slice(0, path.length - 1) : path;
  }
  return path;
}

export const slugify = (rawText: string): string => {
  return (
    rawText
      .toLowerCase()
      // Remove apostrophes
      .replace(/['’]/gi, '')
      // Replace all non-alphanumerics with dashes
      .replace(/\W/gi, '-')
      // Remove dashes at start or end
      .replace(/(^-+)|(-+$)/gi, '')
      // Remove duplicate dashes
      .replace(/-+/gi, '-')
  );
};

export const fallbackSrc = (src: string) => {
  return (event: any): void => {
    if (event?.target?.src && event?.target?.src !== src) {
      event.target.src = src;
    }
  };
};

export const key = (...values: (string | number)[]): string => {
  return values.map((val) => `${val}`).join('-');
};

export const uuid = (): string => {
  return uuidv4();
};

export const replaceAll = (find: string, replace: string, original: string): string => {
  return original.split(find).join(replace);
};

/** Returns a lowercase s if the provided value is a number that is not 1, or an array that has a length other than 1. Useful for pluralizing display text. */
export const getPluralS = (numOrArr?: number | any[]) => {
  let val = 0;
  if (typeof numOrArr !== 'undefined') {
    if (Array.isArray(numOrArr)) {
      val = numOrArr.length;
    } else {
      val = numOrArr;
    }
  }
  return val !== 1 ? 's' : '';
};

/**
 * Return a number array range with `count` number of ascending number elements, starting at 0.
 * @param count The number of elements in the array.
 * @returns A number array range with `count` number of ascending number elements, starting at 0. `[0, 1, 2, 3, ...]`
 */
export const range = (count: number): number[] => {
  return [...Array(count).keys()];
};

export const KeyCode = KeyCodeJS;
