import { PageProps } from 'gatsby';
import React, { JSX } from 'react';
import DefaultPasswordPage from '../components/pages/DefaultPasswordPage';

export default function Password(props: PageProps<any>): JSX.Element {
  return <DefaultPasswordPage {...props} />;
}

// Page query goes here
