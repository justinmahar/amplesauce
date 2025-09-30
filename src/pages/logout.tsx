import { PageProps } from 'gatsby';
import React, { JSX } from 'react';
import DefaultLogoutPage from '../components/pages/DefaultLogoutPage';

export default function Logout(props: PageProps<any>): JSX.Element {
  return <DefaultLogoutPage {...props} />;
}

// Page query goes here
