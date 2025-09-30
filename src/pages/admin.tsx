import { PageProps } from 'gatsby';
import React, { JSX } from 'react';
import DefaultAdminPage from '../components/pages/DefaultAdminPage';

export default function Admin(props: PageProps<any>): JSX.Element {
  return <DefaultAdminPage {...props} />;
}

// Page query goes here
