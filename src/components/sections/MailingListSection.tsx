import React, { JSX } from 'react';
import { Form } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Spinner } from 'react-bootstrap';
import { submitForm } from '../utils/utils';
import { CancelableFormControl } from '../misc/CancelableFormControl';
import { InputChangeEvent } from '../misc/InputChangeEvent';

interface Props {}

const formAction =
  'https://docs.google.com/forms/u/0/d/e/1FAIpQLSfVDoBs-7h6fFkox7pdJBWNBzfr8vOQlMk8Uf-SYiOhz4p4sg/formResponse';

export const MailingListSection = (props: Props): JSX.Element => {
  const formRef = React.useRef<HTMLFormElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [sending, setSending] = React.useState(false);
  const [enteredEmail, setEnteredEmail] = React.useState('');
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
        .finally(() => setEnteredEmail(''));
    }
  };

  return (
    <div className="bg-primary py-5">
      <Container>
        <Row>
          <Col md={{ offset: 2, span: 8 }}>
            {!completed && (
              <>
                <h2 className="text-white text-center text-shadow-xs">Get the inside scoop.</h2>
                <h4 className="text-white text-center text-shadow-xs">
                  Get fresh content delivered straight to your inbox.
                </h4>
                <Form ref={formRef} onSubmit={handleSubmit}>
                  <div className="mb-2">
                    <Form.Group controlId="mailing-list-email">
                      <CancelableFormControl
                        type="email"
                        required
                        placeholder="Enter your email"
                        name="emailAddress"
                        value={enteredEmail}
                        onCancel={() => setEnteredEmail('')}
                        onChange={(e: InputChangeEvent) => setEnteredEmail(e.target.value)}
                        onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            buttonRef.current?.click();
                          }
                        }}
                      />
                    </Form.Group>
                  </div>
                  <div className="d-flex justify-content-end">
                    <Button type="submit" variant="warning" ref={buttonRef} disabled={sending}>
                      {!sending ? (
                        'Sign Up'
                      ) : (
                        <>
                          <Spinner animation="border" role="status" size="sm" /> Sending...
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </>
            )}
            {completed && (
              <>
                <h2 className="text-white text-center text-shadow-xs mt-4">🎉 You're all set!</h2>
                <h4 className="text-white text-center text-shadow-xs mt-2">
                  You'll receive a confirmation email shortly.
                </h4>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};
