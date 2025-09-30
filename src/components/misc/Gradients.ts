/**
 * Go to https://www.gradientmagic.com/ for drop-in gradients.
 */
export class Gradients {
  /**
   * Convenience function to add an overlay background. This will return gradient styles containing
   * the backgroundImage (or background) style prefixed with the provided overlay style, and will include blend
   * modes prefixed with `overlay`.
   *
   * Example using a 220x220px [PNG noise](http://noisepng.com/) overlay:
   * ```js
   *   Gradients.withOverlay('url(/media/noise.png) top center/220px 220px repeat', Gradients.deepBlue)
   * ```
   *
   * You can use free tools like [NoisePNG](http://noisepng.com/) to create noise images.
   *
   * @param overlayBackgroundStyle Background style for the overlay.
   * @param gradientStyles Gradient styles to add overlay to.
   * @returns Gradient styles containing background and background blend mode properties that include the overlay.
   */
  public static withOverlay = (
    overlayBackgroundStyle: string,
    gradientStyles: React.CSSProperties,
  ): React.CSSProperties => {
    const styles: React.CSSProperties = {};
    styles.background = `${overlayBackgroundStyle}${(gradientStyles.backgroundImage ?? gradientStyles.background) ? `, ${gradientStyles.backgroundImage ?? gradientStyles.background}` : ''}`;
    styles.backgroundBlendMode = `overlay, ${gradientStyles.backgroundBlendMode ?? 'normal'}`;
    return styles;
  };

  /**
   * Converts CSS into React CSS style properties. Must only contain styles in the format: `style-name: value; style-name-2: value2;`
   *
   * @param cssString The CSS string to convert to React CSS props.
   * @returns React CSS props for the styles in the provided CSS string.
   */
  public static cssToStyleProps = (cssString: string): Record<string, any> => {
    const styleProps: Record<string, any> = {};
    const rules = cssString.split(';').map((p) => p.trim());
    rules.forEach((rule) => {
      const [property, value] = rule.split(':').map((s) => s.trim());
      if (property && value) {
        const camelCaseProperty = property
          .split('-')
          .map((s, i) => (i === 0 ? s.toLowerCase() : s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()))
          .join('');
        styleProps[camelCaseProperty] = value;
      }
    });
    return styleProps;
  };
}
