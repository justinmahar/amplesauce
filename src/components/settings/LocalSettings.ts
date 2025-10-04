import React from 'react';
import { useLocalStorage } from 'react-storage-complete';
import { useSiteSettingsContext } from '../contexts/SiteSettingsProvider';
import { useUserAccountContext } from '../contexts/UserAccountProvider';

/**
 * Local settings for the application.
 */
export enum LocalSettingsKeys {
  adminViewDisabledState = 'adminViewDisabledState',
  templateState = 'templateState',
  darkModeEnabledState = 'darkModeEnabledState',
  elevenLabsApiKey = 'elevenLabsApiKey',
  elevenLabsSelectedVoiceId = 'elevenLabsSelectedVoiceId',
  elevenLabsModelId = 'elevenLabsModelId',
  elevenLabsOutputFormat = 'elevenLabsOutputFormat',
  elevenLabsStability = 'elevenLabsStability',
  elevenLabsSimilarityBoost = 'elevenLabsSimilarityBoost',
  elevenLabsStyle = 'elevenLabsStyle',
  elevenLabsUseSpeakerBoost = 'elevenLabsUseSpeakerBoost',
  elevenLabsText = 'elevenLabsText',
  elevenLabsMusicPrompt = 'elevenLabsMusicPrompt',
  elevenLabsMusicLengthSecs = 'elevenLabsMusicLengthSecs',
  elevenLabsMusicForceInstrumental = 'elevenLabsMusicForceInstrumental',
  elevenLabsMusicOutputFormat = 'elevenLabsMusicOutputFormat',
}

export const LocalSettingsDefaults = {
  [LocalSettingsKeys.adminViewDisabledState]: false,
  [LocalSettingsKeys.templateState]: false,
  [LocalSettingsKeys.darkModeEnabledState]: true,
  [LocalSettingsKeys.elevenLabsApiKey]: '',
  [LocalSettingsKeys.elevenLabsSelectedVoiceId]: '',
  [LocalSettingsKeys.elevenLabsModelId]: 'eleven_multilingual_v2',
  [LocalSettingsKeys.elevenLabsOutputFormat]: 'mp3_44100_128',
  [LocalSettingsKeys.elevenLabsStability]: 0.5,
  [LocalSettingsKeys.elevenLabsSimilarityBoost]: 0.75,
  [LocalSettingsKeys.elevenLabsStyle]: 0.1,
  [LocalSettingsKeys.elevenLabsUseSpeakerBoost]: true,
  [LocalSettingsKeys.elevenLabsText]: '',
  [LocalSettingsKeys.elevenLabsMusicPrompt]: '',
  [LocalSettingsKeys.elevenLabsMusicLengthSecs]: 30,
  [LocalSettingsKeys.elevenLabsMusicForceInstrumental]: true,
  [LocalSettingsKeys.elevenLabsMusicOutputFormat]: 'mp3_44100_128',
};

export const useLocalSettings = () => {
  const siteSettings = useSiteSettingsContext();
  const userAccountLoader = useUserAccountContext();
  const userUid = React.useMemo(() => userAccountLoader.user?.uid ?? 'guest', [userAccountLoader.user?.uid]);
  const prefix = React.useMemo(
    () => `[${siteSettings?.data.site.siteMetadata.siteUrl}].${userUid}`,
    [siteSettings?.data.site.siteMetadata.siteUrl, userUid],
  );
  const storageOptions = React.useMemo(() => {
    return {
      prefix,
    };
  }, [prefix]);

  return {
    [LocalSettingsKeys.adminViewDisabledState]: useLocalStorage(
      LocalSettingsKeys.adminViewDisabledState,
      LocalSettingsDefaults[LocalSettingsKeys.adminViewDisabledState],
      storageOptions,
    ),
    [LocalSettingsKeys.templateState]: useLocalStorage(
      LocalSettingsKeys.templateState,
      LocalSettingsDefaults[LocalSettingsKeys.templateState],
      storageOptions,
    ),
    [LocalSettingsKeys.darkModeEnabledState]: useLocalStorage(
      LocalSettingsKeys.darkModeEnabledState,
      LocalSettingsDefaults[LocalSettingsKeys.darkModeEnabledState],
      storageOptions,
    ),
    [LocalSettingsKeys.elevenLabsApiKey]: useLocalStorage<string>(
      LocalSettingsKeys.elevenLabsApiKey,
      LocalSettingsDefaults[LocalSettingsKeys.elevenLabsApiKey],
      storageOptions,
    ),
    [LocalSettingsKeys.elevenLabsSelectedVoiceId]: useLocalStorage<string>(
      LocalSettingsKeys.elevenLabsSelectedVoiceId,
      LocalSettingsDefaults[LocalSettingsKeys.elevenLabsSelectedVoiceId],
      storageOptions,
    ),
    [LocalSettingsKeys.elevenLabsModelId]: useLocalStorage<string>(
      LocalSettingsKeys.elevenLabsModelId,
      LocalSettingsDefaults[LocalSettingsKeys.elevenLabsModelId],
      storageOptions,
    ),
    [LocalSettingsKeys.elevenLabsOutputFormat]: useLocalStorage<string>(
      LocalSettingsKeys.elevenLabsOutputFormat,
      LocalSettingsDefaults[LocalSettingsKeys.elevenLabsOutputFormat],
      storageOptions,
    ),
    [LocalSettingsKeys.elevenLabsStability]: useLocalStorage<number>(
      LocalSettingsKeys.elevenLabsStability,
      LocalSettingsDefaults[LocalSettingsKeys.elevenLabsStability],
      storageOptions,
    ),
    [LocalSettingsKeys.elevenLabsSimilarityBoost]: useLocalStorage<number>(
      LocalSettingsKeys.elevenLabsSimilarityBoost,
      LocalSettingsDefaults[LocalSettingsKeys.elevenLabsSimilarityBoost],
      storageOptions,
    ),
    [LocalSettingsKeys.elevenLabsStyle]: useLocalStorage<number>(
      LocalSettingsKeys.elevenLabsStyle,
      LocalSettingsDefaults[LocalSettingsKeys.elevenLabsStyle],
      storageOptions,
    ),
    [LocalSettingsKeys.elevenLabsUseSpeakerBoost]: useLocalStorage<boolean>(
      LocalSettingsKeys.elevenLabsUseSpeakerBoost,
      LocalSettingsDefaults[LocalSettingsKeys.elevenLabsUseSpeakerBoost],
      storageOptions,
    ),
    [LocalSettingsKeys.elevenLabsText]: useLocalStorage<string>(
      LocalSettingsKeys.elevenLabsText,
      LocalSettingsDefaults[LocalSettingsKeys.elevenLabsText],
      storageOptions,
    ),
    [LocalSettingsKeys.elevenLabsMusicPrompt]: useLocalStorage<string>(
      LocalSettingsKeys.elevenLabsMusicPrompt,
      LocalSettingsDefaults[LocalSettingsKeys.elevenLabsMusicPrompt],
      storageOptions,
    ),
    [LocalSettingsKeys.elevenLabsMusicLengthSecs]: useLocalStorage<number>(
      LocalSettingsKeys.elevenLabsMusicLengthSecs,
      LocalSettingsDefaults[LocalSettingsKeys.elevenLabsMusicLengthSecs],
      storageOptions,
    ),
    [LocalSettingsKeys.elevenLabsMusicForceInstrumental]: useLocalStorage<boolean>(
      LocalSettingsKeys.elevenLabsMusicForceInstrumental,
      LocalSettingsDefaults[LocalSettingsKeys.elevenLabsMusicForceInstrumental],
      storageOptions,
    ),
    [LocalSettingsKeys.elevenLabsMusicOutputFormat]: useLocalStorage<string>(
      LocalSettingsKeys.elevenLabsMusicOutputFormat,
      LocalSettingsDefaults[LocalSettingsKeys.elevenLabsMusicOutputFormat],
      storageOptions,
    ),
  };
};

export type LocalSettingsType = ReturnType<typeof useLocalSettings>;
