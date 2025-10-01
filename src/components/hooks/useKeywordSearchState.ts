import React from 'react';
import { useLocalStorage } from 'react-storage-complete';

/**
 * Shared state for the Keyword Research input.
 */
export const useKeywordSearchState = () => {
  const [keyword, setKeyword] = useLocalStorage<string>('sandbox.keywordResearch.keyword', '');
  const set = React.useCallback((v: string) => setKeyword(v), [setKeyword]);
  return { keyword: keyword ?? '', setKeyword: set };
};
