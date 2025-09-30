import React from 'react';
import TrackVisibility from 'react-on-screen';

export interface VisibleOnScreenPixelProps {
  onChange?: (visible: boolean) => void;
}

/**
 * Use to track when visible on screen.
 */
export const VisibleOnScreenPixel = ({ onChange }: VisibleOnScreenPixelProps) => {
  return (
    <TrackVisibility partialVisibility>
      <Pixel onChange={onChange} />
    </TrackVisibility>
  );
};

interface PixelProps {
  isVisible?: boolean;
  onChange?: (visible: boolean) => void;
}

export const Pixel = ({ isVisible, onChange }: PixelProps) => {
  const [visible, setVisible] = React.useState(false);
  const [changeTime, setChangeTime] = React.useState(0);
  React.useEffect(() => {
    if (typeof isVisible === 'boolean' && isVisible !== visible) {
      setVisible(isVisible);
      setChangeTime(Date.now());
    }
  }, [isVisible, onChange, visible]);

  React.useEffect(() => {
    if (changeTime > 0 && onChange) {
      try {
        onChange(visible);
      } catch (e) {
        console.error(e);
      }
    }
  }, [changeTime]); // Only run when visible state actually changes

  return <div style={{ width: 1, height: 1, maxWidth: 1, maxHeight: 1 }} />;
};
