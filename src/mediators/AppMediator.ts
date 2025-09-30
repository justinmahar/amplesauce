import React from 'react';
import { useProfileSetupMediator } from './useProfileSetupMediator';

export interface AppMediatorProps {
  children: React.ReactNode;
}

export const AppMediator = ({ children }: AppMediatorProps): React.JSX.Element => {
  useProfileSetupMediator();
  return React.createElement(React.Fragment, null, children);
};
