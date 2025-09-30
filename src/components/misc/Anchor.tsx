import classNames from 'classnames';
import React from 'react';
import { AProps } from 'react-html-props';

export interface AnchorProps extends AProps {
  blank?: boolean;
  to?: string;
}

export const Anchor = ({ blank, to, ...aProps }: AnchorProps) => {
  const target = blank ? '_blank' : undefined;
  const rel = blank ? 'noopener noreferrer' : undefined;
  return (
    <a
      href={to}
      target={target}
      rel={rel}
      {...aProps}
      className={classNames(aProps.className)}
      style={{ ...aProps.style }}
    >
      {aProps.children}
    </a>
  );
};
