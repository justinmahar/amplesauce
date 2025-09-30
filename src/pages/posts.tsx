import { PageProps } from 'gatsby';
import React, { JSX } from 'react';
import DefaultPostsPage from '../components/pages/DefaultPostsPage';

export default function Posts(props: PageProps<any>): JSX.Element {
  return <DefaultPostsPage {...props} />;
}

// Page query goes here
