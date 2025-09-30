import { PageProps } from 'gatsby';
import * as React from 'react';
import { FaEye } from 'react-icons/fa';
import { Alert, Button, Card, Col, Container, Form, FormControl, InputGroup, Row, Spinner } from 'react-bootstrap';
import { getRankForViews, RankData } from '../game/rules/ranks';
import { getRarityForVideo, RarityInfo } from '../game/rules/rarity';
import Body from '../layout/Body';
import Layout from '../layout/Layout';
import { useSiteSettingsContext } from '../contexts/SiteSettingsProvider';
import { SectionBackground } from '../sections/parts/SectionBackground';
import Head from '../layout/Head';
import { Altar } from '../game/Altar';

interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
  viewCount: string | null;
  rank: RankData;
  rarity: RarityInfo;
}

export default function EggScannerPage(props: PageProps<any>): React.JSX.Element {
  const contentTitle = 'Egg Scanner';
  const description = 'Scan your eggs';

  const [youtubeUrl, setYoutubeUrl] = React.useState('');
  const [videos, setVideos] = React.useState<Video[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [testLoading, setTestLoading] = React.useState(false);
  const [testResult, setTestResult] = React.useState<string | null>(null);
  const siteSettings = useSiteSettingsContext();

  const handleTestFirestore = async () => {
    if (!siteSettings) {
      setTestResult('Site settings not loaded yet.');
      return;
    }

    setTestLoading(true);
    setTestResult(null);
    try {
      const edgeFunctionsRoot = siteSettings.data.settingsYaml.edgeFunctionsRoot;
      const response = await fetch(`${edgeFunctionsRoot}/api/test-firestore`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Test failed.');
      }

      setTestResult(`Success! Document written. Server response: ${JSON.stringify(data.data)}`);
    } catch (err: any) {
      setTestResult(`Error: ${err.message}`);
    } finally {
      setTestLoading(false);
    }
  };

  const handleScan = async () => {
    if (!siteSettings) {
      setError('Site settings not loaded yet.');
      return;
    }

    const normalizeInput = (input: string): string => {
      const trimmedInput = input.trim();
      // If it looks like a URL, leave it. Otherwise, treat as a handle.
      if (trimmedInput.includes('/') || trimmedInput.includes('.')) {
        return trimmedInput;
      }
      // It's a handle. Prepend the @ if it's missing.
      const handle = trimmedInput.startsWith('@') ? trimmedInput : `@${trimmedInput}`;
      return `https://www.youtube.com/${handle}`;
    };

    setLoading(true);
    setError(null);
    setVideos([]);
    try {
      const edgeFunctionsRoot = siteSettings.data.settingsYaml.edgeFunctionsRoot;
      const urlToSend = normalizeInput(youtubeUrl);
      const response = await fetch(`${edgeFunctionsRoot}/api/scan-youtube-channel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ youtubeUrl: urlToSend }),
      });

      const responseText = await response.text();
      if (!response.ok) {
        // Try to parse error from response, otherwise use a generic message
        try {
          const errorJson = JSON.parse(responseText);
          throw new Error(errorJson.error || 'Failed to fetch videos.');
        } catch {
          throw new Error('Failed to fetch videos.');
        }
      }

      const data = JSON.parse(responseText);

      const mappedVideos: Video[] = data.items.map((item: any) => {
        const viewCount = item.statistics ? parseInt(item.statistics.viewCount, 10) : 0;
        const videoId = item.id.videoId;

        return {
          id: videoId,
          title: item.snippet.title,
          thumbnailUrl: item.snippet.thumbnails.medium.url,
          viewCount: new Intl.NumberFormat().format(viewCount),
          rank: getRankForViews(viewCount),
          rarity: getRarityForVideo(videoId),
        };
      });
      setVideos(mappedVideos);
    } catch (err: any) {
      let displayError = 'An unknown error occurred.';
      if (err instanceof Error) {
        try {
          // Attempt to parse the error message as JSON from the server
          const errorJson = JSON.parse(err.message);
          if (errorJson.error && typeof errorJson.error === 'object') {
            displayError = `Error: ${errorJson.error.message} (Type: ${errorJson.error.name})`;
          } else if (errorJson.error) {
            displayError = `Error: ${errorJson.error}`;
          }
        } catch {
          // If parsing fails, it's a standard error message
          displayError = err.message;
        }
      }
      setError(displayError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head contentTitle={contentTitle} seo={{ description }} />
      <Body>
        <SectionBackground first>
          <Container>
            <Row className="justify-content-center">
              <Col lg={8}>
                <h1 className="text-center mb-4">Egg Scanner</h1>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleScan();
                  }}
                >
                  <InputGroup className="mb-3">
                    <FormControl
                      placeholder="Enter YouTube Channel URL"
                      aria-label="YouTube Channel URL"
                      value={youtubeUrl}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setYoutubeUrl(e.target.value)}
                    />
                    <Button variant="primary" onClick={handleScan} disabled={!youtubeUrl || loading || !siteSettings}>
                      {loading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" role="status" />
                          <span className="visually-hidden">Loading...</span>
                        </>
                      ) : (
                        'Scan'
                      )}
                    </Button>
                    <Button variant="secondary" onClick={handleTestFirestore} disabled={testLoading || !siteSettings}>
                      {testLoading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" role="status" />
                          <span className="visually-hidden">Loading...</span>
                        </>
                      ) : (
                        'Test Firestore'
                      )}
                    </Button>
                  </InputGroup>
                </Form>

                {error && <Alert variant="danger">{error}</Alert>}
                {testResult && (
                  <Alert variant={testResult.startsWith('Error') ? 'danger' : 'success'}>{testResult}</Alert>
                )}

                {videos.length > 0 && (
                  <Row className="justify-content-center">
                    {videos.map((video) => (
                      <Altar
                        key={video.id}
                        id={video.id}
                        title={video.title}
                        thumbnailUrl={video.thumbnailUrl}
                        viewCount={video.viewCount}
                        rank={video.rank}
                        rarity={video.rarity}
                        hasGlow
                      />
                    ))}
                  </Row>
                )}
              </Col>
            </Row>
          </Container>
        </SectionBackground>
      </Body>
    </Layout>
  );
}
