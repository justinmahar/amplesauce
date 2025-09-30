import { navigate, PageProps } from 'gatsby';
import * as React from 'react';
import { Accordion, Col, Container, Row } from 'react-bootstrap';
import Body from '../layout/Body';
import Layout from '../layout/Layout';
import { PageRoutes } from './PageRoutes';
import { AdminMarkdownAccordionItem } from '../admin/AdminMarkdownAccordionItem';
import { AdminSettingsAccordionItem } from '../admin/AdminSettingsAccordionItem';
import { UtilityFunctionAccordionItem } from '../admin/UtilityFunctionAccordionItem';
import { useSiteSettingsContext } from '../contexts/SiteSettingsProvider';
import { useUserSettingsContext } from '../contexts/UserSettingsProvider';
import EmulatorToggleCard from '../debug/EmulatorToggleCard';
import { useRequireLogin } from '../hooks/useRequireLogin';
import Head from '../layout/Head';
import { PlaceholderStack } from '../misc/PlaceholderStack';
import { SectionBackground } from '../sections/parts/SectionBackground';

export default function DefaultAdminPage(props: PageProps<any>): React.JSX.Element {
  const contentTitle = `Admin`;
  const description = `Admin page`;

  const siteSettings = useSiteSettingsContext();
  const userSettingsLoader = useUserSettingsContext();

  const [loggedIn, fullyLoaded] = useRequireLogin(PageRoutes.admin);
  const authorized = fullyLoaded && userSettingsLoader.userSettings?.isAdmin();

  React.useEffect(() => {
    if (fullyLoaded && loggedIn && !authorized) {
      console.error('Not authorized! Logging out...');
      navigate(PageRoutes.logout);
    }
  }, [authorized, fullyLoaded, loggedIn]);

  return (
    <Layout>
      <Head contentTitle={contentTitle} seo={{ description: description }} />
      <Body>
        <SectionBackground first spacing={{ xs: 20 }}>
          {authorized && (
            <Container>
              <Row className="mb-3">
                <Col>
                  <h1>{contentTitle}</h1>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <Accordion defaultActiveKey="settings">
                    <AdminSettingsAccordionItem eventKey="settings" />
                  </Accordion>
                  <Accordion defaultActiveKey="markdown">
                    <AdminMarkdownAccordionItem eventKey="markdown" />
                  </Accordion>
                  <Accordion defaultActiveKey="utility-function">
                    <UtilityFunctionAccordionItem eventKey="utility-function" />
                  </Accordion>
                </Col>
              </Row>
              {siteSettings?.data.site.siteMetadata.siteEnvironment === 'development' && (
                <Row className="mb-3">
                  <Col>
                    <EmulatorToggleCard />
                  </Col>
                </Row>
              )}
            </Container>
          )}
          {!authorized && (
            <Container className="my-3">
              <Row>
                <Col>
                  <PlaceholderStack count={5} animation="wave" />
                </Col>
              </Row>
            </Container>
          )}
        </SectionBackground>
      </Body>
    </Layout>
  );
}
