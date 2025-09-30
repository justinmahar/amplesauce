import { PageProps } from 'gatsby';
import * as React from 'react';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import Body from '../layout/Body';
import Layout from '../layout/Layout';
import { useLogout } from '../hooks/useLogout';
import Head from '../layout/Head';
import { SectionBackground } from '../sections/parts/SectionBackground';

export default function DefaultLogoutPage(props: PageProps<any>): React.JSX.Element {
  const contentTitle = `Logout`;
  const description = `Logging out of {siteName}`;

  const logout = useLogout();

  React.useEffect(() => logout(), [logout]);

  return (
    <Layout>
      <Head contentTitle={contentTitle} seo={{ description: description }} />
      <Body>
        <SectionBackground first>
          <Container>
            <Row>
              <Col>
                <h2 className="mb-4 text-center">Logging out...</h2>
                <h2 className="mb-4 text-center">
                  <Spinner animation="border" role="status" />
                </h2>
              </Col>
            </Row>
          </Container>
        </SectionBackground>
      </Body>
    </Layout>
  );
}
