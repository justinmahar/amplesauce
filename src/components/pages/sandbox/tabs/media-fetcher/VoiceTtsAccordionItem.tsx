import React from 'react';
import { Accordion, Button, Card, Col, Form, Row } from 'react-bootstrap';

export type VoiceTtsAccordionItemProps = { eventKey: string };

export const VoiceTtsAccordionItem = ({ eventKey }: VoiceTtsAccordionItemProps): React.JSX.Element => {
  return (
    <Accordion.Item eventKey={eventKey}>
      <Accordion.Header>Voice (TTS) — ElevenLabs</Accordion.Header>
      <Accordion.Body>
        <Card className="mb-3">
          <Card.Body>
            <Row className="g-2">
              <Col md={6}>
                <Form.Group controlId="ttsText">
                  <Form.Label>Text</Form.Label>
                  <Form.Control as="textarea" rows={4} placeholder="Enter narration text..." />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Row className="g-2">
                  <Col md={6}>
                    <Form.Group controlId="ttsVoice">
                      <Form.Label>Voice</Form.Label>
                      <Form.Select>
                        <option>Default</option>
                        <option>Male (Warm)</option>
                        <option>Female (Bright)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="ttsStability">
                      <Form.Label>Stability</Form.Label>
                      <Form.Range />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group controlId="ttsStyle">
                      <Form.Label>Style</Form.Label>
                      <Form.Select>
                        <option>Neutral</option>
                        <option>Conversational</option>
                        <option>Promo</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>
            <div className="mt-3 d-flex gap-2">
              <Button variant="primary">Synthesize</Button>
              <Button variant="outline-secondary">Save to Library</Button>
            </div>
          </Card.Body>
        </Card>
      </Accordion.Body>
    </Accordion.Item>
  );
};
