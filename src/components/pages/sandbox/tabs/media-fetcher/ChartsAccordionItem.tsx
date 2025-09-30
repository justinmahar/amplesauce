import React from 'react';
import { Accordion, Button, Card, Col, Form, Row } from 'react-bootstrap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

export type ChartsAccordionItemProps = { eventKey: string };

export const ChartsAccordionItem = ({ eventKey }: ChartsAccordionItemProps): React.JSX.Element => {
  const [type, setType] = React.useState<'Bar' | 'Line' | 'Pie'>('Bar');
  const [dataJson, setDataJson] = React.useState<string>(
    JSON.stringify(
      {
        labels: ['A', 'B', 'C', 'D'],
        datasets: [
          { label: 'Series 1', data: [12, 19, 3, 5], backgroundColor: 'rgba(99, 102, 241, 0.6)' },
          { label: 'Series 2', data: [8, 11, 7, 9], backgroundColor: 'rgba(16, 185, 129, 0.6)' },
        ],
      },
      null,
      2,
    ),
  );
  const [parsed, setParsed] = React.useState<any | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    ChartJS.register(
      CategoryScale,
      LinearScale,
      BarElement,
      LineElement,
      ArcElement,
      PointElement,
      Tooltip,
      Legend,
      Filler,
    );
  }, []);

  const handleRender = (): void => {
    try {
      const obj = JSON.parse(dataJson);
      setParsed(obj);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
      setParsed(null);
    }
  };

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
                  <Form.Select value={type} onChange={(e) => setType(e.target.value as 'Bar' | 'Line' | 'Pie')}>
                    <option value="Bar">Bar</option>
                    <option value="Line">Line</option>
                    <option value="Pie">Pie</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="chartData">
                  <Form.Label>Data (JSON)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={8}
                    value={dataJson}
                    onChange={(e) => setDataJson(e.target.value)}
                    placeholder='{"labels":["A","B"],"datasets":[{"data":[1,2]}]}'
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="mt-3 d-flex gap-2">
              <Button variant="primary" onClick={handleRender}>
                Render Preview
              </Button>
              <Button variant="outline-secondary">Add to Library</Button>
            </div>
            {!!error && <div className="text-danger small mt-2">{error}</div>}
            {!!parsed && (
              <div className="mt-3">
                {type === 'Bar' && <Bar data={parsed} />}
                {type === 'Line' && <Line data={parsed} />}
                {type === 'Pie' && <Pie data={parsed} />}
              </div>
            )}
          </Card.Body>
        </Card>
      </Accordion.Body>
    </Accordion.Item>
  );
};
