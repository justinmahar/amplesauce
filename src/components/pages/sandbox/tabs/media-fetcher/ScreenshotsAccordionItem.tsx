import React from 'react';
import { Accordion, Button, Card, Col, Form, Row, Image } from 'react-bootstrap';

export type ScreenshotsAccordionItemProps = { eventKey: string };

export const ScreenshotsAccordionItem = ({ eventKey }: ScreenshotsAccordionItemProps): React.JSX.Element => {
  const [url, setUrl] = React.useState('https://example.com');
  const [width, setWidth] = React.useState<number>(1280);
  const [cropHeight, setCropHeight] = React.useState<number | ''>('');
  const [apiKey, setApiKey] = React.useState('');
  const [previewSrc, setPreviewSrc] = React.useState<string | null>(null);

  const buildThumIoUrl = React.useCallback((): string => {
    const options: string[] = [];
    // Order: auth, width, crop
    if (apiKey.trim()) {
      options.push(`auth/${apiKey.trim()}`);
    }
    if (width && Number(width) > 0) {
      options.push(`width/${Number(width)}`);
    }
    if (cropHeight && Number(cropHeight) > 0) {
      options.push(`crop/${Number(cropHeight)}`);
    }
    const base = 'https://image.thum.io/get';
    const optPath = options.join('/');
    const encodedTarget = encodeURIComponent(url.trim());
    // Use the documented ?url= scheme so the target is encoded properly
    return optPath ? `${base}/${optPath}/?url=${encodedTarget}` : `${base}/?url=${encodedTarget}`;
  }, [apiKey, width, cropHeight, url]);

  const handlePreview = (): void => {
    if (!url.trim()) {
      return;
    }
    setPreviewSrc(buildThumIoUrl());
  };

  return (
    <Accordion.Item eventKey={eventKey}>
      <Accordion.Header>Screenshots — Headless Browser</Accordion.Header>
      <Accordion.Body>
        <Card className="mb-3">
          <Card.Body>
            <Row className="g-2 align-items-end">
              <Col md={6}>
                <Form.Group controlId="screenshotUrl">
                  <Form.Label>URL</Form.Label>
                  <Form.Control
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="width">
                  <Form.Label>Width (px)</Form.Label>
                  <Form.Control
                    type="number"
                    min={320}
                    max={3840}
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value) || 1280)}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="cropHeight">
                  <Form.Label>Crop Height (px)</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    max={6000}
                    value={cropHeight}
                    onChange={(e) => setCropHeight(e.target.value === '' ? '' : Number(e.target.value) || 0)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="g-2 mt-1">
              <Col md={6}>
                <Form.Group controlId="thumIoKey">
                  <Form.Label>Thum.io API Key (optional)</Form.Label>
                  <Form.Control
                    placeholder="Key for higher limits/features"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <div className="text-muted small mt-1">We build a Thum.io URL client-side for previewing.</div>
                  <div className="text-muted small mt-1">
                    Service by{' '}
                    <a href="https://www.thum.io" target="_blank" rel="noreferrer">
                      thum.io
                    </a>
                  </div>
                </Form.Group>
              </Col>
            </Row>
            <div className="mt-3 d-flex gap-2">
              <Button variant="primary" onClick={handlePreview}>
                Preview via Thum.io
              </Button>
              <Button variant="outline-secondary">Save to Library</Button>
            </div>
            {!!previewSrc && (
              <div className="mt-3">
                <div className="text-muted small mb-1">Preview</div>
                <Image src={previewSrc} alt="screenshot preview" fluid rounded />
                <div className="text-muted small mt-1" style={{ wordBreak: 'break-all' }}>
                  {previewSrc}
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      </Accordion.Body>
    </Accordion.Item>
  );
};
