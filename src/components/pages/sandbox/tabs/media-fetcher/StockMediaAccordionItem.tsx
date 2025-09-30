import React from 'react';
import { Accordion, Button, Card, Col, Form, Row } from 'react-bootstrap';

export type StockMediaAccordionItemProps = { eventKey: string };

export const StockMediaAccordionItem = ({ eventKey }: StockMediaAccordionItemProps): React.JSX.Element => {
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
                  <Form.Control placeholder="e.g., sunset beach, circuit board, city skyline" />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="stockProvider">
                  <Form.Label>Provider</Form.Label>
                  <Form.Select>
                    <option>Pexels</option>
                    <option>Unsplash</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="stockType">
                  <Form.Label>Type</Form.Label>
                  <Form.Select>
                    <option>Images</option>
                    <option>Videos</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row className="g-2 mt-1">
              <Col md={4}>
                <Form.Group controlId="orientation">
                  <Form.Label>Orientation</Form.Label>
                  <Form.Select>
                    <option>Any</option>
                    <option>Landscape</option>
                    <option>Portrait</option>
                    <option>Square</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="colorTheme">
                  <Form.Label>Color Theme</Form.Label>
                  <Form.Control placeholder="#hex or color name" />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="resultsPerPage">
                  <Form.Label>Results</Form.Label>
                  <Form.Select>
                    <option>20</option>
                    <option>40</option>
                    <option>80</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <div className="mt-3 d-flex gap-2">
              <Button variant="primary">Search</Button>
              <Button variant="outline-secondary">Add Selected to Library</Button>
            </div>
          </Card.Body>
        </Card>
      </Accordion.Body>
    </Accordion.Item>
  );
};
