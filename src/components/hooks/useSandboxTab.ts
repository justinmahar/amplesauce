import React from 'react';
import { useQueryParamString } from 'react-use-query-param-string';

// Constants
const TAB_QUERY_KEY = 'tab';
const DEFAULT_TAB = 'Niche Hunter';

// Types/Interfaces
export type SandboxTab =
  | 'Niche Hunter'
  | 'Keyword Research'
  | 'Content Research'
  | 'Remotion'
  | 'Media Fetcher'
  | 'Thumbnail Maker'
  | string; // Fallback to allow future tabs without code change

/**
 * Provides getter/setter for the Sandbox tab via query param.
 */
export const useSandboxTab = () => {
  const [tabValue, setTabValue, tabInitialized] = useQueryParamString(TAB_QUERY_KEY, DEFAULT_TAB, true);
  const currentTab: SandboxTab = (tabInitialized && tabValue) || DEFAULT_TAB;

  const setTab = React.useCallback(
    (t: SandboxTab) => {
      setTabValue(t);
    },
    [setTabValue],
  );

  return { currentTab, setTab };
};
