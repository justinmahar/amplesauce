import classNames from 'classnames';
import React, { JSX } from 'react';
import { DivProps } from 'react-html-props';
import { BasicFooterSection } from '../sections/BasicFooterSection';

export interface FooterProps extends DivProps {}

export default function Footer(props: FooterProps): JSX.Element {
  return (
    <div {...props} className={classNames(props.className)} style={{ ...props.style }}>
      <BasicFooterSection />
    </div>
  );
}
