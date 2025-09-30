declare module 'html2markdown';
// Initialized in onCreateWebpackConfig. Can be used anywhere in the app.
declare const __COMMIT_HASH__: string;
declare const __BRANCH_NAME__: string;
declare const __ENVIRONMENT__: string;
declare const __SITE_VERSION__: string;

declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';

// Netlify Edge Functions environment variables
// This makes the Netlify global available to TypeScript
declare const Netlify: {
  env: {
    get: (key: string) => string | undefined;
  };
};

// Type declaration for URL module import
declare module 'https://esm.sh/he@1.2.0' {
  export function decode(text: string): string;
}
