import { PageProps } from 'gatsby';
import React, { JSX } from 'react';
import DefaultPrivacyPage from '../components/pages/DefaultPrivacyPage';

export default function Privacy(props: PageProps<any>): JSX.Element {
  return <DefaultPrivacyPage {...props} />;
}

// Page query goes here
