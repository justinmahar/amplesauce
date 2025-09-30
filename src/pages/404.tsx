import { PageProps } from 'gatsby';
import React, { JSX } from 'react';
import DefaultNotFoundPage from '../components/pages/DefaultNotFoundPage';

export default function NotFound(props: PageProps<any>): JSX.Element {
  return <DefaultNotFoundPage {...props} />;
}

// Page query goes here
