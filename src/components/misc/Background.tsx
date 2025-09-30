import classNames from 'classnames';
import React from 'react';
import { DivProps } from 'react-html-props';

const defaultOpacity = 0.3;

export interface BacksplashStyles {
  src?: string;
}

export interface BackgroundProps extends DivProps {
  src?: string;
  bgStyle?: React.CSSProperties;
}

export const Background = ({ src, bgStyle = {}, ...divProps }: BackgroundProps) => {
  const styles = { ...bgStyle };
  // src shorthand: Specifying a bg src will preconfigure a few background properties. Any of these can be overridden by specifying them.
  if (src) {
    styles.background = styles.background ?? `url(${src})`;
    styles.backgroundRepeat = styles.backgroundRepeat ?? 'no-repeat';
    styles.backgroundPosition = styles.backgroundPosition ?? '50% 50%';
    styles.backgroundSize = styles.backgroundSize ?? 'cover';
  }
  return (
    <div
      {...divProps}
      className={classNames('position-relative', divProps.className)}
      style={{ position: 'relative', ...divProps.style }}
    >
      <div className="w-100 h-100 d-block position-absolute start-0 top-0" style={styles} />
      <div className="position-relative w-100 h-100">{divProps.children}</div>
    </div>
  );
};
