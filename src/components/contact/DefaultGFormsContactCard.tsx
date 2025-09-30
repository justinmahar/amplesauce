import React, { ChangeEvent } from 'react';
import { Alert, Button, Card, CardProps, Form, Spinner } from 'react-bootstrap';
import { submitForm } from '../utils/utils';
import { CancelableFormControl } from '../misc/CancelableFormControl';

interface Props extends CardProps {
  formAction: string;
  subjectName: string;
  messageName: string;
  originName: string;
}

export const DefaultGFormsContactCard = ({ formAction, subjectName, messageName, originName, ...cardProps }: Props) => {
  const [email, setEmail] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [message, setMessage] = React.useState('');

  const formRef = React.useRef<HTMLFormElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const [sending, setSending] = React.useState(false);
  const [completed, setCompleted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    doSubmit();
  };

  const doSubmit = () => {
    if (formRef.current) {
      setSending(true);
      submitForm(formAction, formRef.current, { method: 'POST', mode: 'no-cors' })
        .then(() => {
          setSending(false);
          setCompleted(true);
        })
        .catch(() => setSending(false))
        .finally(() => {
          setEmail('');
          setSubject('');
          setMessage('');
        });
    }
  };

  return (
    <Card {...cardProps}>
      <Card.Body>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <Form.Group controlId="form-email" className="mb-2">
            <Form.Label>Email</Form.Label>
            <CancelableFormControl
              type="email"
              placeholder="Enter email"
              required
              name="emailAddress"
              value={email}
              onCancel={() => setEmail('')}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="form-subject" className="mb-2">
            <Form.Label>Subject</Form.Label>
            <CancelableFormControl
              type="text"
              placeholder="Enter subject"
              required
              name={subjectName}
              value={subject}
              onCancel={() => setSubject('')}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="form-message" className="mb-3">
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              required
              name={messageName}
              value={message}
              placeholder="Enter message"
              onChange={(e) => setMessage(e.target.value)}
            />
          </Form.Group>
          <input
            type="hidden"
            name={originName}
            value={typeof window !== 'undefined' ? window.location.href : 'Unknown'}
          />
          {completed && (
            <Alert variant="info" dismissible onClose={() => setCompleted(false)}>
              Your message was sent!
            </Alert>
          )}
          <div className="d-flex justify-content-between align-items-end">
            <p className="text-muted mb-0 small me-2">
              Powered by{' '}
              <a className="text-reset" href="https://www.google.com/forms/about/">
                Google Forms
              </a>
            </p>
            <Button ref={buttonRef} variant="primary" type="submit" disabled={sending}>
              {!sending ? (
                'Send'
              ) : (
                <>
                  <Spinner animation="border" role="status" size="sm" /> Sending...
                </>
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};
