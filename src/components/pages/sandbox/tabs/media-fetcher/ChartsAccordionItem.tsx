import React from 'react';
import { Accordion, Button, Card, Col, Form, Row } from 'react-bootstrap';

export type ChartsAccordionItemProps = { eventKey: string };

export const ChartsAccordionItem = ({ eventKey }: ChartsAccordionItemProps): React.JSX.Element => {
  return (
    <Accordion.Item eventKey={eventKey}>
      <Accordion.Header>Charts — ChartJS</Accordion.Header>
      <Accordion.Body>
        <Card className="mb-3">
          <Card.Body>
            <Row className="g-2 align-items-end">
              <Col md={6}>
                <Form.Group controlId="chartType">
                  <Form.Label>Chart Type</Form.Label>
                  <Form.Select>
                    <option>Bar</option>
                    <option>Line</option>
                    <option>Pie</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="chartData">
                  <Form.Label>Data (JSON)</Form.Label>
                  <Form.Control as="textarea" rows={4} placeholder='{"labels":["A","B"],"datasets":[{"data":[1,2]}]}' />
                </Form.Group>
              </Col>
            </Row>
            <div className="mt-3 d-flex gap-2">
              <Button variant="primary">Render Preview</Button>
              <Button variant="outline-secondary">Add to Library</Button>
            </div>
          </Card.Body>
        </Card>
      </Accordion.Body>
    </Accordion.Item>
  );
};
