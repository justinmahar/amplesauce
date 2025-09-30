import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';
import { Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import Body from '../layout/Body';
import Layout from '../layout/Layout';
import { useUserSettingsContext } from '../contexts/UserSettingsProvider';
import { ConnectYouTubeButton } from '../auth/ConnectYouTubeButton';
import { useSiteSettings } from '../../settings/useSiteSettings';
import { useRequireLogin } from '../hooks/useRequireLogin';
import { Channel } from '../firebase/firestore/models/UserSettings';
import Head from '../layout/Head';

/**
 * A custom profile page that allows users to manage their account.
 */
export const CustomProfilePage = () => {
  useRequireLogin();
  const { userSettings, loading } = useUserSettingsContext();
  const siteSettings = useSiteSettings();
  const clientId = siteSettings.data.settingsYaml.googleOauthClientId;

  const channels = userSettings?.getChannels() || {};
  const channelIds = Object.keys(channels);

  const renderChannels = () => {
    if (loading) {
      return (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      );
    }

    if (channelIds.length === 0) {
      return <p>You haven't connected any channels yet.</p>;
    }

    return (
      <Row xs={1} md={2} lg={3} xl={4} className="g-4">
        {channelIds.map((channelId) => {
          const channel: Channel = channels[channelId];
          return (
            <Col key={channelId}>
              <Card style={{ maxWidth: '22rem' }} className="mx-auto">
                <Card.Img variant="top" src={channel.thumbnailUrl} />
                <Card.Body>
                  <Card.Title>{channel.title}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    );
  };

  if (!clientId || clientId === 'YOUR_CLIENT_ID_HERE') {
    return (
      <Layout>
        <Head contentTitle="Profile" />
        <Body className="pt-5">
          <Container className="py-5">
            <h1>Configuration Error</h1>
            <p>
              The Google OAuth Client ID has not been configured. Please add it to your{' '}
              <code>src/settings/settings.yml</code> file.
            </p>
          </Container>
        </Body>
      </Layout>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Layout>
        <Head contentTitle="Profile" />
        <Body className="pt-5">
          <Container className="py-5">
            <h1>Profile</h1>
            <p>Manage your account settings and connected channels here.</p>
            <hr />
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Connected Channels</h2>
              <ConnectYouTubeButton />
            </div>
            {renderChannels()}
          </Container>
        </Body>
      </Layout>
    </GoogleOAuthProvider>
  );
};
