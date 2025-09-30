import { PageProps } from 'gatsby';
import * as React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Body from '../layout/Body';
import Layout from '../layout/Layout';
import Head from '../layout/Head';
import { SectionBackground } from '../sections/parts/SectionBackground';

export default function DefaultTemplatePage(props: PageProps<any>): React.JSX.Element {
  const contentTitle = 'My Page Title';
  const description = 'A description of this page';

  return (
    <Layout>
      <Head contentTitle={contentTitle} seo={{ description }} />
      <Body>
        <SectionBackground first>
          <Container>
            <Row>
              <Col>Page content goes here.</Col>
            </Row>
          </Container>
        </SectionBackground>
      </Body>
    </Layout>
  );
}
