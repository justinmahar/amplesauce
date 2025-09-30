import { PageProps } from 'gatsby';
import * as React from 'react';
import Body from '../layout/Body';
import Layout from '../layout/Layout';
import Head from '../layout/Head';
import { BasicContactSection } from '../sections/BasicContactSection';

export default function DefaultContactPage(props: PageProps<any>): React.JSX.Element {
  const contentTitle = `Contact`;
  const description = `If you'd like to reach out, just fill out the form and hit Send.`;

  return (
    <Layout>
      <Head contentTitle={contentTitle} seo={{ description: description }} />
      <Body className="py-0">
        <BasicContactSection first />
      </Body>
    </Layout>
  );
}
