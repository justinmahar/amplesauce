import classNames from 'classnames';
import React from 'react';
import { Badge, BadgeProps } from 'react-bootstrap';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { useLocalSettingsContext } from '../contexts/LocalSettingsProvider';
import { LocalSettingsKeys } from '../settings/LocalSettings';

export interface ThemeBadgeProps extends BadgeProps {
  size?: number;
}

export const ThemeBadge = ({ size = 20, ...props }: ThemeBadgeProps) => {
  const localSettings = useLocalSettingsContext();
  const [darkModeEnabled, setDarkModeEnabled] = localSettings[LocalSettingsKeys.darkModeEnabledState];
  return (
    <div {...props} className={classNames(props.className)} style={{ ...props.style }}>
      <Badge
        pill
        bg={darkModeEnabled ? 'black' : 'primary'}
        onClick={() => setDarkModeEnabled(!darkModeEnabled)}
        className={'d-flex align-items-center cursor-pointer user-select-none p-1 fs-6'}
      >
        <DarkModeSwitch
          checked={!!darkModeEnabled}
          onChange={() => setDarkModeEnabled(!darkModeEnabled)}
          size={size}
          sunColor="white"
          moonColor="#F39C12"
        />
        {/* {!!darkModeEnabled ? <FaMoon className="text-warning" /> : <FaSun className="text-white" />} */}
      </Badge>
    </div>
  );
};
