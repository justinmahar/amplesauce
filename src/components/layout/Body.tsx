import React from 'react';
import { DivPropsWithoutRef } from 'react-html-props';
import styled from 'styled-components';

export interface BodyProps {
  children?: React.ReactNode;
}
export default function Body({ children, ...props }: DivPropsWithoutRef): JSX.Element {
  return <BodyDiv {...props}>{children}</BodyDiv>;
}

const BodyDiv = styled.div`
  /* padding-top: 3em;
  padding-bottom: 4em; */
  /* min-height: 400vh; */

  /* Uncomment to enable fade */
  /* & {
    opacity: 1;
    animation-name: fadeInOpacity;
    animation-iteration-count: 1;
    animation-timing-function: ease-in;
    animation-duration: 0.08s;
  }
  @keyframes fadeInOpacity {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  } */
`;
