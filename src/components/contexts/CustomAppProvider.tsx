import React from 'react';
import { ElementProps } from 'react-html-props';

export const CustomAppProvider = ({ children }: ElementProps) => {
  return <>{children}</>;
};
