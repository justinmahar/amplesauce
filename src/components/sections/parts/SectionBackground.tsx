import classNames from 'classnames';
import React from 'react';
import { DivProps } from 'react-html-props';
import { useThemeContext } from '../../contexts/ThemeProvider';
import { useSiteSettingsContext } from '../../contexts/SiteSettingsProvider';
import { Background } from '../../misc/Background';
import { Gradients } from '../../misc/Gradients';
import { ResponsiveSpacer, ResponsiveSpacing } from './ResponsiveSpacer';

export interface SectionBackgroundProps extends DivProps {
  /** True if this section appears first on the page. If so, extra top padding will be added to account for the navbar. */
  first?: boolean;
  spacing?: number | ResponsiveSpacing;
  src?: string;
  gradientStyles?: React.CSSProperties;
  noise?: boolean;
  bgStyle?: React.CSSProperties;
  themedText?: boolean;
}
export const noiseBgOverlayStyle = 'url(/media/noise.png) top center/220px repeat';

export const SectionBackground = ({
  first = false,
  spacing = 40,
  src,
  gradientStyles,
  bgStyle,
  noise,
  themedText = false,
  ...props
}: SectionBackgroundProps) => {
  const siteSettings = useSiteSettingsContext();
  const headerHeight = siteSettings?.data.settingsYaml.headerHeight ?? 80;

  const theme = useThemeContext();
  const textClass = theme.darkModeEnabled ? 'text-white' : 'text-black';

  return (
    <Background
      src={src}
      bgStyle={{
        ...(noise && gradientStyles ? Gradients.withOverlay(noiseBgOverlayStyle, gradientStyles) : gradientStyles),
        ...bgStyle,
      }}
      {...props}
      className={classNames('section-background', themedText && textClass, props.className)}
      style={{
        ...props.style,
      }}
    >
      <ResponsiveSpacer size={spacing} style={{ paddingTop: first ? headerHeight : 0 }} />
      {props.children}
      <ResponsiveSpacer size={spacing} />
    </Background>
  );
};
