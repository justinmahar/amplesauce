import { Link, PageProps } from 'gatsby';
import * as React from 'react';
import { Button, Container } from 'react-bootstrap';
import styled from 'styled-components';
import Body from '../layout/Body';
import Layout from '../layout/Layout';
import { PageRoutes } from './PageRoutes';
import Head from '../layout/Head';
import { SectionBackground } from '../sections/parts/SectionBackground';

export default function DefaultNotFoundPage(props: PageProps<any>): React.JSX.Element {
  const contentTitle = `404 Not Found`;
  const description = `Sorry, we couldn't find what you were looking for.`;

  return (
    <Layout>
      <Head contentTitle={contentTitle} seo={{ description: description }} />
      <Body>
        <SectionBackground first>
          <Container className="text-center">
            <NotFoundTitleDiv>404</NotFoundTitleDiv>
            <h1>Well, shoot.</h1>
            <br />
            <h5>We couldn't find what you were looking for.</h5>
            <br />
            <Link to={PageRoutes.index}>
              <Button variant="secondary">&laquo; Home</Button>
            </Link>
          </Container>
        </SectionBackground>
      </Body>
    </Layout>
  );
}

const NotFoundTitleDiv = styled.div`
  font-size: 600%;
`;
