import * as sw from 'stopword';

export const slugify = (text) => {
  const createSlug = (rawText) => {
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
  // Remove all stop words, make resulting array lowercase and distinct, join with dashes, then create the slug
  let slug = createSlug(
    [...new Set(sw.removeStopwords(text.split(/[!?:;,."*()\s]/)).map((word) => word.toLowerCase()))].join('-'),
  );
  // If the slug is empty after doing so, simply slugify the text without removing stop words
  if (slug.length === 0) {
    slug = createSlug(text);
  }
  // If even THEN the slug is still empty, just make it lowercase and alphanumeric with dashes
  if (slug.length === 0) {
    slug = text
      .toLowerCase()
      // Replace all non-alphanumerics with dashes
      .replace(/\W/gi, '-');
  }
  return slug;
};
