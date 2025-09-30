import { PageProps } from 'gatsby';
import React, { JSX } from 'react';
import DefaultLoginPage from '../components/pages/DefaultLoginPage';

export default function Login(props: PageProps<any>): JSX.Element {
  return <DefaultLoginPage {...props} />;
}

// Page query goes here
