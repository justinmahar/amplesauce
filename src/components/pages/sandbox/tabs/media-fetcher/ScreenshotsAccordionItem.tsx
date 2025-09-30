import React from 'react';
import { Accordion, Button, Card, Col, Form, Row } from 'react-bootstrap';

export type ScreenshotsAccordionItemProps = { eventKey: string };

export const ScreenshotsAccordionItem = ({ eventKey }: ScreenshotsAccordionItemProps): React.JSX.Element => {
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
                  <Form.Control placeholder="https://example.com" />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="viewport">
                  <Form.Label>Viewport</Form.Label>
                  <Form.Select>
                    <option>1280x720</option>
                    <option>1920x1080</option>
                    <option>1080x1920</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="fullPage">
                  <Form.Check type="checkbox" label="Full Page" />
                </Form.Group>
              </Col>
            </Row>
            <div className="mt-3 d-flex gap-2">
              <Button variant="primary">Capture</Button>
              <Button variant="outline-secondary">Save to Library</Button>
            </div>
          </Card.Body>
        </Card>
      </Accordion.Body>
    </Accordion.Item>
  );
};
