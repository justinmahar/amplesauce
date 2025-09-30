import React, { JSX } from 'react';
import { Placeholder, Stack } from 'react-bootstrap';
import { Variant } from 'react-bootstrap/esm/types';
import { PlaceholderAnimation } from 'react-bootstrap/esm/usePlaceholder';
import { DivPropsWithoutRef } from 'react-html-props';

interface Props extends DivPropsWithoutRef {
  count?: number;
  animation?: PlaceholderAnimation;
  bg?: Variant;
}

export const PlaceholderStack = ({ count, animation, bg, ...props }: Props): JSX.Element => {
  const placeholderCount = count && count > 0 ? count : 1;
  const placeholderAnimation = animation || 'wave';
  const time = React.useRef(new Date().getTime());
  const placeholderDivElements = [...Array(placeholderCount).keys()].map((_v, index) => {
    return (
      <div key={`placeholder-${time}-${index}`}>
        <Placeholder animation={placeholderAnimation} bg={bg}>
          <Placeholder xs={6} /> <Placeholder className="w-75" /> <Placeholder className="w-25" />
        </Placeholder>
      </div>
    );
  });
  return (
    <Stack gap={3} {...props}>
      {placeholderDivElements}
    </Stack>
  );
};
