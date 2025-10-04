import React from 'react';
import { useLocalSettingsContext } from '../components/contexts/LocalSettingsProvider';
import { LocalSettingsKeys } from '../components/settings/LocalSettings';

// Returns the StorageState tuple for the ElevenLabs API key
export const useElevenLabsApiKey = () => {
  const localSettings = useLocalSettingsContext();
  return localSettings[LocalSettingsKeys.elevenLabsApiKey];
};
