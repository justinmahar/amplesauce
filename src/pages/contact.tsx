import { PageProps } from 'gatsby';
import React, { JSX } from 'react';
import DefaultContactPage from '../components/pages/DefaultContactPage';

export default function Contact(props: PageProps<any>): JSX.Element {
  return <DefaultContactPage {...props} />;
}

// Page query goes here
