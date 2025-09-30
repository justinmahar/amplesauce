import { PageProps } from 'gatsby';
import * as React from 'react';
import { Col, Container, Row, Stack } from 'react-bootstrap';
import Body from '../layout/Body';
import Layout from '../layout/Layout';
import LoginCard from '../auth/LoginCard';
import { useSiteSettingsContext } from '../contexts/SiteSettingsProvider';
import { useUserAccountContext } from '../contexts/UserAccountProvider';
import EmulatorToggleCard from '../debug/EmulatorToggleCard';
import { firestore } from '../firebase/firebase-app';
import Head from '../layout/Head';
import { SectionBackground } from '../sections/parts/SectionBackground';

export const REDIRECT_QUERY_PARAM_KEY = 'redirect';

export default function DefaultLoginPage(props: PageProps<any>): React.JSX.Element {
  const contentTitle = `Login`;
  const description = `Log in to {siteName}`;
  const siteSettings = useSiteSettingsContext();
  const headerHeight = siteSettings?.data.settingsYaml.headerHeight ?? 80;

  const userAccountLoader = useUserAccountContext();
  const user = userAccountLoader.user;
  const [shouldRunSetup, setShouldRunSetup] = React.useState(false);

  const onLoginSuccess = (): void => {
    setShouldRunSetup(true);
  };

  React.useEffect(() => {
    if (shouldRunSetup && user && firestore) {
      setShouldRunSetup(false);

      // TODO: Populate user settings on backend
      // UserSettings.populateDefaultUserSettings(user, firestore)
      //   .then((_docSnapshot: DocumentSnapshot<DocumentData>) => {
      //     let redirected = false;
      //     const queryParams = getQueryParams();
      //     if (queryParams[REDIRECT_QUERY_PARAM_KEY]) {
      //       navigate(`${queryParams[REDIRECT_QUERY_PARAM_KEY]}`);
      //       redirected = true;
      //     }

      //     if (!redirected) {
      //       navigate(siteSettings?.data.settingsYaml.postLoginRoute ?? PageRoutes.profile);
      //     }
      //   })
      //   .catch((error: Error) => {
      //     console.error('Error populating settings', error);
      //   });
    }
  }, [shouldRunSetup, userAccountLoader, user, props.location.search, siteSettings?.data.settingsYaml.postLoginRoute]);

  return (
    <Layout>
      <Head contentTitle={contentTitle} seo={{ description: description }} />
      <Body>
        <SectionBackground first>
          <Container>
            <Row>
              <Col md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }} xl={{ span: 4, offset: 4 }}>
                <Stack gap={3}>
                  <LoginCard onSuccess={onLoginSuccess} />
                  {siteSettings?.data.site.siteMetadata.siteEnvironment === 'development' && (
                    <EmulatorToggleCard className="shadow-sm" />
                  )}
                </Stack>
              </Col>
            </Row>
          </Container>
        </SectionBackground>
      </Body>
    </Layout>
  );
}
