import classNames from 'classnames';
import React, { JSX } from 'react';
import { Accordion, Alert, Button, Spinner, Stack } from 'react-bootstrap';
import { AccordionItemProps } from 'react-bootstrap/esm/AccordionItem';
import { useSiteSettingsContext } from '../contexts/SiteSettingsProvider';

interface Props extends AccordionItemProps {}

export const UtilityFunctionAccordionItem = (props: Props): JSX.Element => {
  const siteSettings = useSiteSettingsContext();

  const [wasError, setWasError] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleRunFunction = () => {
    if (siteSettings) {
      const fetchEndpoint = `${siteSettings.getCloudFunctionsRoot()}/functionName`;

      setMessage('');
      setWasError(false);
      setLoading(true);
      setMessage(`Calling: ${fetchEndpoint}`);

      fetch(fetchEndpoint, {
        method: 'GET',
      })
        .then((response) => {
          if (response.status === 200) {
            response.text().then((text) => {
              try {
                console.log(JSON.parse(text));
              } catch (error) {
                console.log(text);
              }
              setMessage(text);
              setWasError(false);
            });
          } else {
            console.error(response);
            response.text().then((text) => {
              setMessage(text);
              setWasError(true);
              try {
                console.error(JSON.parse(text));
              } catch (error) {
                console.error(text);
              }
            });
          }
        })
        .catch((error) => {
          setMessage(`${error}`);
          console.error(error);
          setWasError(true);
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <Accordion.Item {...props}>
      <Accordion.Header>Utility Function</Accordion.Header>
      <Accordion.Body>
        <Stack gap={1}>
          <p>Run a utility cloud function to perform various tasks during development.</p>
          <div>
            <Button variant="primary" onClick={handleRunFunction} disabled={loading}>
              {!loading && 'Run Now'}
              {loading && (
                <>
                  <Spinner animation="border" role="status" size="sm" /> Running...
                </>
              )}
            </Button>
          </div>
          {message && (
            <div>
              <Alert
                variant={wasError ? 'danger' : 'info'}
                className={classNames(!wasError && 'font-monospace', 'text-break')}
                dismissible
                onClose={() => setMessage('')}
              >
                {message}
              </Alert>
            </div>
          )}
        </Stack>
      </Accordion.Body>
    </Accordion.Item>
  );
};
