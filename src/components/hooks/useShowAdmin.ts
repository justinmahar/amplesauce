import { LocalSettingsKeys } from '../settings/LocalSettings';
import { useLocalSettingsContext } from '../contexts/LocalSettingsProvider';
import { useUserSettingsContext } from '../contexts/UserSettingsProvider';

export const useShowAdmin = () => {
  const localSettings = useLocalSettingsContext();
  const [adminViewDisabled] = localSettings[LocalSettingsKeys.adminViewDisabledState];
  const userSettingsLoader = useUserSettingsContext();
  const showAdmin = !!userSettingsLoader.userSettings?.isAdmin() && !adminViewDisabled;
  return showAdmin;
};
