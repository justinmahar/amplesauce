import React from 'react';
import { Accordion, Button, Card, Col, Form, Row } from 'react-bootstrap';

export type EmojisIconsAccordionItemProps = { eventKey: string };

export const EmojisIconsAccordionItem = ({ eventKey }: EmojisIconsAccordionItemProps): React.JSX.Element => {
  return (
    <Accordion.Item eventKey={eventKey}>
      <Accordion.Header>Emojis / Icons</Accordion.Header>
      <Accordion.Body>
        <Card className="mb-3">
          <Card.Body>
            <Row className="g-2 align-items-end">
              <Col md={8}>
                <Form.Group controlId="emojiQuery">
                  <Form.Label>Search</Form.Label>
                  <Form.Control placeholder="e.g., rocket, chart, smile" />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="emojiStyle">
                  <Form.Label>Style</Form.Label>
                  <Form.Select>
                    <option>Twemoji</option>
                    <option>Noto</option>
                    <option>Native</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <div className="mt-3 d-flex gap-2">
              <Button variant="primary">Find</Button>
              <Button variant="outline-secondary">Add Selected</Button>
            </div>
          </Card.Body>
        </Card>
      </Accordion.Body>
    </Accordion.Item>
  );
};
