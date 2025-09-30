import { PageProps } from 'gatsby';
import React, { JSX } from 'react';
import DefaultTermsPage from '../components/pages/DefaultTermsPage';

export default function Terms(props: PageProps<any>): JSX.Element {
  return <DefaultTermsPage {...props} />;
}

// Page query goes here
