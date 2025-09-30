import { PageProps } from 'gatsby';
import * as React from 'react';
import Body from '../layout/Body';
import Layout from '../layout/Layout';
import Head from '../layout/Head';
import { BasicHeroSection } from '../sections/BasicHeroSection';
import { BasicPostsSection } from '../sections/BasicPostsSection';

export default function DefaultIndexPage(props: PageProps<any>): React.JSX.Element {
  const pageTitle = `{siteName}`;
  const description = `{siteDescription}`;
  return (
    <Layout>
      <Head seo={{ title: pageTitle, description: description }} />
      <Body className="py-0">
        <BasicHeroSection first />
        <BasicPostsSection />
      </Body>
    </Layout>
  );
}
