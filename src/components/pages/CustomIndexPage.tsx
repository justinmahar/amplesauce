import { PageProps } from 'gatsby';
import * as React from 'react';
import { Alert, Button, Container, Form, InputGroup, Spinner } from 'react-bootstrap';
import Body from '../layout/Body';
import Layout from '../layout/Layout';
import Head from '../layout/Head';
import { SectionBackground } from '../sections/parts/SectionBackground';
import { useChat } from '../hooks/useChat';
import Markdown from 'react-markdown';
import { VideoSchema } from '../genkit/VideoSchema';

export default function CustomIndexPage(_props: PageProps<unknown>): React.JSX.Element {
  const contentTitle = 'Home';
  const description = 'Start by entering a value below.';

  const [queryValue, setQueryValue] = React.useState<string>('');

  const { sendMessage, isLoading, response, error } = useChat();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setQueryValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const prompt = `
    Generate an example video.
    `;

    void sendMessage({ prompt, schema: JSON.stringify(VideoSchema) });
  };

  return (
    <Layout>
      <Head contentTitle={contentTitle} seo={{ description }} />
      <Body>
        <SectionBackground first>
          <Container className="py-5 d-flex flex-column align-items-center justify-content-center">
            <Form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: 640 }}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Enter your prompt"
                  value={queryValue}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <Button type="submit" variant="primary" disabled={isLoading}>
                  Go
                </Button>
              </InputGroup>
            </Form>
            <div className="w-100 mt-3" style={{ maxWidth: 640 }}>
              {isLoading && (
                <div className="text-muted d-flex justify-content-center align-items-center gap-2">
                  <Spinner animation="border" size="sm" role="status" className="me-2" />
                  <span>Generating...</span>
                </div>
              )}
              {!!error && (
                <Alert variant="danger" className="mt-2 mb-0">
                  {error}
                </Alert>
              )}
              {!!response && !isLoading && (
                <Alert variant="secondary" className="mt-2 mb-0">
                  {response.output?.message && (
                    <p>
                      <Markdown>{response.output?.message}</Markdown>
                    </p>
                  )}
                  <pre className="mb-0" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </Alert>
              )}
            </div>
          </Container>
        </SectionBackground>
      </Body>
    </Layout>
  );
}
