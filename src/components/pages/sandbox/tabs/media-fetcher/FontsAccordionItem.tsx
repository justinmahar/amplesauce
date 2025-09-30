import React from 'react';
import { Accordion, Button, Card, Col, Form, Row } from 'react-bootstrap';

export type FontsAccordionItemProps = { eventKey: string };

export const FontsAccordionItem = ({ eventKey }: FontsAccordionItemProps): React.JSX.Element => {
  return (
    <Accordion.Item eventKey={eventKey}>
      <Accordion.Header>Fonts — Google Fonts</Accordion.Header>
      <Accordion.Body>
        <Card className="mb-3">
          <Card.Body>
            <Row className="g-2 align-items-end">
              <Col md={6}>
                <Form.Group controlId="fontFamily">
                  <Form.Label>Font Family</Form.Label>
                  <Form.Control placeholder="e.g., Inter, Roboto, Lato" />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="fontWeights">
                  <Form.Label>Weights</Form.Label>
                  <Form.Control placeholder="e.g., 400,500,700" />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="fontSubsets">
                  <Form.Label>Subsets</Form.Label>
                  <Form.Control placeholder="e.g., latin, latin-ext" />
                </Form.Group>
              </Col>
            </Row>
            <div className="mt-3 d-flex gap-2">
              <Button variant="primary">Fetch</Button>
              <Button variant="outline-secondary">Add to Project</Button>
            </div>
          </Card.Body>
        </Card>
      </Accordion.Body>
    </Accordion.Item>
  );
};
