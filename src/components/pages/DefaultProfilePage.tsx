import { Link, PageProps } from 'gatsby';
import * as React from 'react';
import { Badge, Button, Col, Container, Image, Row, Stack } from 'react-bootstrap';
import Body from '../layout/Body';
import Layout from '../layout/Layout';
import { PageRoutes } from './PageRoutes';
import { LogoutModal } from '../auth/LogoutModal';
import { useUser } from '../contexts/UserAccountProvider';
import { useUserSettingsContext } from '../contexts/UserSettingsProvider';
import { useRequireLogin } from '../hooks/useRequireLogin';
import Head from '../layout/Head';
import { PlaceholderStack } from '../misc/PlaceholderStack';
import { createGravatarUrl } from '../misc/gravatar';
import { SectionBackground } from '../sections/parts/SectionBackground';

export default function DefaultProfilePage(props: PageProps<any>): React.JSX.Element {
  const contentTitle = `Profile`;
  const description = `This is your user profile`;
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const user = useUser();
  const email = user?.email || 'Error retrieving email';
  const userSettings = useUserSettingsContext();
  const displayName = userSettings.userSettings?.getDisplayName() || 'Loading...';

  const [loggedIn, fullyLoaded] = useRequireLogin(PageRoutes.profile);

  if (fullyLoaded && loggedIn) {
    return (
      <Layout>
        <LogoutModal show={showLogoutModal} setShow={setShowLogoutModal} />
        <Head contentTitle={contentTitle} seo={{ description: description }} />
        <Body>
          <SectionBackground first>
            <LogoutModal show={showLogoutModal} setShow={setShowLogoutModal} />
            <Container>
              <Row>
                <Col lg={{ offset: 3, span: 6 }}>
                  <h1 className="mb-4">Profile</h1>
                  <Stack gap={4}>
                    <div className="d-flex">
                      <div className="flex-shrink-0">
                        <Image src={createGravatarUrl(email)} roundedCircle />
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <div className="d-flex flex-wrap justify-content-between gap-2">
                          <div>
                            <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
                              <h4 className="mb-0 text-break me-1">{displayName}</h4>
                              <div>
                                {userSettings.userSettings?.isAdmin() && (
                                  <Link to={PageRoutes.admin}>
                                    <Badge bg="danger">Admin</Badge>
                                  </Link>
                                )}
                              </div>
                            </div>
                            <p className="text-break">{email}</p>
                          </div>
                          <div>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                setShowLogoutModal(true);
                              }}
                            >
                              Logout
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Stack>
                </Col>
              </Row>
            </Container>
          </SectionBackground>
        </Body>
      </Layout>
    );
  }

  return (
    <Layout>
      <LogoutModal show={showLogoutModal} setShow={setShowLogoutModal} />
      <Head contentTitle={contentTitle} seo={{ description: description }} />
      <Body>
        <Container className="my-3">
          <Row>
            <Col lg={{ offset: 3, span: 6 }}>
              <PlaceholderStack count={5} animation="wave" />
            </Col>
          </Row>
        </Container>
      </Body>
    </Layout>
  );
}
