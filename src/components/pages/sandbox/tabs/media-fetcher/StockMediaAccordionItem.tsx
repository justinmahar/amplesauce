import React from 'react';
import { Accordion, Button, Card, Col, Form, Row, Image, Spinner } from 'react-bootstrap';

export type StockMediaAccordionItemProps = { eventKey: string };

export const StockMediaAccordionItem = ({ eventKey }: StockMediaAccordionItemProps): React.JSX.Element => {
  const [query, setQuery] = React.useState('');
  const [provider, setProvider] = React.useState<'Pexels' | 'Unsplash'>('Pexels');
  const [mediaType, setMediaType] = React.useState<'Images' | 'Videos'>('Images');
  const [orientation, setOrientation] = React.useState<'Any' | 'Landscape' | 'Portrait' | 'Square'>('Any');
  const [colorTheme, setColorTheme] = React.useState('');
  const [perPage, setPerPage] = React.useState<number>(20);
  const [pexelsKey, setPexelsKey] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  type PexelsPhoto = { id: number; alt?: string; src?: { small?: string; medium?: string; original?: string } };
  type PexelsVideoFile = { link?: string; file_type?: string; width?: number };
  type PexelsVideo = {
    id: number;
    image?: string;
    video_files?: PexelsVideoFile[];
    video_pictures?: { picture?: string }[];
  };
  const [photoResults, setPhotoResults] = React.useState<PexelsPhoto[]>([]);
  const [videoResults, setVideoResults] = React.useState<PexelsVideo[]>([]);
  const [playingVideoId, setPlayingVideoId] = React.useState<number | null>(null);

  const getBestVideoUrl = (v: PexelsVideo): string => {
    const files = Array.isArray(v?.video_files) ? v.video_files : [];
    if (files.length === 0) {
      return '';
    }
    // Prefer smaller width mp4 to keep preview light
    const mp4s = files.filter((f) => (f?.file_type || '').includes('mp4'));
    const sorted = (mp4s.length ? mp4s : files).sort((a, b) => (a?.width || 0) - (b?.width || 0));
    return sorted[0]?.link || '';
  };

  const mapOrientation = (o: typeof orientation): string | undefined => {
    if (o === 'Landscape') {
      return 'landscape';
    }
    if (o === 'Portrait') {
      return 'portrait';
    }
    if (o === 'Square') {
      return 'square';
    }
    return undefined;
  };

  const handleSearch = async () => {
    setError(null);
    setLoading(true);
    setPhotoResults([]);
    setVideoResults([]);
    try {
      if (provider === 'Pexels') {
        if (!pexelsKey.trim()) {
          throw new Error('Enter a Pexels API key.');
        }
        const headers = { Authorization: pexelsKey.trim() } as Record<string, string>;
        const params: Record<string, string> = {
          query: query.trim(),
          per_page: `${perPage}`,
          page: '1',
        };
        const o = mapOrientation(orientation);
        if (o) {
          params.orientation = o;
        }
        if (colorTheme.trim()) {
          params.color = colorTheme.trim().replace('#', '');
        }
        if (mediaType === 'Images') {
          const url = `https://api.pexels.com/v1/search?${new URLSearchParams(params).toString()}`;
          const res = await fetch(url, { headers });
          if (!res.ok) {
            throw new Error(`Pexels photos failed: ${res.status} ${res.statusText}`);
          }
          const data = await res.json();
          setPhotoResults(Array.isArray(data?.photos) ? data.photos : []);
        } else {
          const url = `https://api.pexels.com/videos/search?${new URLSearchParams(params).toString()}`;
          const res = await fetch(url, { headers });
          if (!res.ok) {
            throw new Error(`Pexels videos failed: ${res.status} ${res.statusText}`);
          }
          const data = await res.json();
          setVideoResults(Array.isArray(data?.videos) ? data.videos : []);
        }
      } else {
        setError('Unsplash search not implemented yet.');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Accordion.Item eventKey={eventKey}>
      <Accordion.Header>Stock Media — Pexels / Unsplash</Accordion.Header>
      <Accordion.Body>
        <Card className="mb-3">
          <Card.Body>
            <Row className="g-2 align-items-end">
              <Col md={6}>
                <Form.Group controlId="stockQuery">
                  <Form.Label>Search Query</Form.Label>
                  <Form.Control
                    placeholder="e.g., sunset beach, circuit board, city skyline"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="stockProvider">
                  <Form.Label>Provider</Form.Label>
                  <Form.Select value={provider} onChange={(e) => setProvider(e.target.value as 'Pexels' | 'Unsplash')}>
                    <option value="Pexels">Pexels</option>
                    <option value="Unsplash">Unsplash</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="stockType">
                  <Form.Label>Type</Form.Label>
                  <Form.Select value={mediaType} onChange={(e) => setMediaType(e.target.value as 'Images' | 'Videos')}>
                    <option value="Images">Images</option>
                    <option value="Videos">Videos</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row className="g-2 mt-1">
              <Col md={4}>
                <Form.Group controlId="orientation">
                  <Form.Label>Orientation</Form.Label>
                  <Form.Select
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value as typeof orientation)}
                  >
                    <option value="Any">Any</option>
                    <option value="Landscape">Landscape</option>
                    <option value="Portrait">Portrait</option>
                    <option value="Square">Square</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="colorTheme">
                  <Form.Label>Color Theme</Form.Label>
                  <Form.Control
                    placeholder="#hex or color name"
                    value={colorTheme}
                    onChange={(e) => setColorTheme(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="resultsPerPage">
                  <Form.Label>Results</Form.Label>
                  <Form.Select value={perPage} onChange={(e) => setPerPage(Number(e.target.value) || 20)}>
                    <option value={20}>20</option>
                    <option value={40}>40</option>
                    <option value={80}>80</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            {provider === 'Pexels' && (
              <Row className="g-2 mt-1">
                <Col md={6}>
                  <Form.Group controlId="pexelsApiKey">
                    <Form.Label>Pexels API Key</Form.Label>
                    <Form.Control
                      placeholder="Enter your Pexels API key"
                      value={pexelsKey}
                      onChange={(e) => setPexelsKey(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}
            <div className="mt-3 d-flex gap-2">
              <Button variant="primary" onClick={handleSearch} disabled={loading}>
                {loading ? (
                  <span className="d-flex align-items-center gap-2">
                    <Spinner animation="border" size="sm" role="status" />
                    <span>Searching...</span>
                  </span>
                ) : (
                  'Search'
                )}
              </Button>
              <Button variant="outline-secondary">Add Selected to Library</Button>
            </div>
            {!!error && <div className="text-danger small mt-2">{error}</div>}
            {!error && !loading && provider === 'Pexels' && mediaType === 'Images' && photoResults.length > 0 && (
              <Row className="mt-3 g-3">
                {photoResults.map((p) => (
                  <Col key={`pex-photo-${p.id}`} md={3} sm={4} xs={6}>
                    <Card>
                      <Image src={p.src?.medium || p.src?.small || p.src?.original} alt={p.alt || ''} fluid />
                      <Card.Body className="p-2">
                        <div className="small text-muted">#{p.id}</div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
            {!error && !loading && provider === 'Pexels' && mediaType === 'Videos' && videoResults.length > 0 && (
              <Row className="mt-3 g-3">
                {videoResults.map((v) => {
                  const thumb = v?.video_pictures?.[0]?.picture || v?.image || '';
                  const isPlaying = playingVideoId === v.id;
                  const videoUrl = isPlaying ? getBestVideoUrl(v) : '';
                  return (
                    <Col key={`pex-video-${v.id}`} md={3} sm={4} xs={6}>
                      <Card>
                        {!isPlaying && (
                          <div
                            style={{ position: 'relative', cursor: 'pointer' }}
                            onClick={() => setPlayingVideoId(v.id)}
                          >
                            <Image src={thumb} alt={`video ${v.id}`} fluid />
                            <div
                              style={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'rgba(0,0,0,0.2)',
                              }}
                            >
                              <div
                                style={{
                                  width: 0,
                                  height: 0,
                                  borderLeft: '18px solid white',
                                  borderTop: '12px solid transparent',
                                  borderBottom: '12px solid transparent',
                                }}
                              />
                            </div>
                          </div>
                        )}
                        {isPlaying && (
                          <div className="ratio ratio-16x9">
                            <video
                              src={videoUrl}
                              controls
                              autoPlay
                              style={{ width: '100%', height: '100%' }}
                              poster={thumb}
                            />
                          </div>
                        )}
                        <Card.Body className="p-2 d-flex justify-content-between align-items-center">
                          <div className="small text-muted mb-0">#{v.id}</div>
                          {isPlaying && (
                            <Button size="sm" variant="outline-secondary" onClick={() => setPlayingVideoId(null)}>
                              Close
                            </Button>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            )}
          </Card.Body>
        </Card>
      </Accordion.Body>
    </Accordion.Item>
  );
};
