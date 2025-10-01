import React from 'react';
import { useLocalStorage } from 'react-storage-complete';

/**
 * Shared state for the Content Research topic input.
 */
export const useContentResearchState = () => {
  const [idea, setIdea] = useLocalStorage<string>('sandbox.contentResearch.idea', '');
  const set = React.useCallback((v: string) => setIdea(v), [setIdea]);
  return { idea: idea ?? '', setIdea: set };
};
