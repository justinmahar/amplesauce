import classNames from 'classnames';
import React from 'react';
import { DivProps } from 'react-html-props';

export interface ResponsiveSpacerProps extends DivProps {
  size: number | ResponsiveSpacing;
}

export const ResponsiveSpacer = ({ size, ...props }: ResponsiveSpacerProps) => {
  const xsYPadding = (typeof size === 'number' ? size : size.xs) ?? 0;
  const smYPadding = (typeof size === 'number' ? size : (size.sm ?? xsYPadding)) ?? 0;
  const mdYPadding = (typeof size === 'number' ? size : (size.md ?? smYPadding)) ?? 0;
  const lgYPadding = (typeof size === 'number' ? size : (size.lg ?? mdYPadding)) ?? 0;
  const xlYPadding = (typeof size === 'number' ? size : (size.xl ?? lgYPadding)) ?? 0;
  const xxlYPadding = (typeof size === 'number' ? size : (size.xxl ?? xlYPadding)) ?? 0;
  return (
    <div {...props} className={classNames(props.className)} style={{ ...props.style }}>
      <div
        className={classNames('d-block d-sm-none')}
        style={{
          paddingTop: xsYPadding,
        }}
      />
      <div
        className={classNames('d-none d-sm-block d-md-none')}
        style={{
          paddingTop: smYPadding,
        }}
      />
      <div
        className={classNames('d-none d-md-block d-lg-none')}
        style={{
          paddingTop: mdYPadding,
        }}
      />
      <div
        className={classNames('d-none d-lg-block d-xl-none')}
        style={{
          paddingTop: lgYPadding,
        }}
      />
      <div
        className={classNames('d-none d-xl-block d-xxl-none')}
        style={{
          paddingTop: xlYPadding,
        }}
      />
      <div
        className={classNames('d-none d-xxl-block')}
        style={{
          paddingTop: xxlYPadding,
        }}
      />
    </div>
  );
};

export interface ResponsiveSpacing {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
}
