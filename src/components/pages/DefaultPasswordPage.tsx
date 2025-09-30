import copy from 'copy-to-clipboard';
import { PageProps } from 'gatsby';
import { navigate } from 'gatsby-link';
import * as React from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { PageRoutes } from './PageRoutes';
import { useSiteSettingsContext } from '../contexts/SiteSettingsProvider';
import { EditorIcons } from '../editor/EditorIcons';
import { useMomentaryBool } from 'react-use-precision-timer';
import { usePasswordProtection } from '../hooks/usePasswordProtection';
import Head from '../layout/Head';
import { CancelableFormControl } from '../misc/CancelableFormControl';
import { IconButton } from '../misc/IconButton';

export default function DefaultPasswordPage(props: PageProps<any>): React.JSX.Element {
  const siteSettings = useSiteSettingsContext();
  const contentTitle = 'Password';
  const description = 'Password protected site';

  const [enteredPassword, setEnteredPassword] = React.useState('');
  const [copied, toggleCopied] = useMomentaryBool(false, 1000);

  const PasswordProtection = usePasswordProtection();

  const submit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (PasswordProtection.accessGranted) {
      navigate(PageRoutes.index);
    }
  };

  const copyHash = () => {
    toggleCopied();
    copy(PasswordProtection.passwordHash);
  };

  return (
    <div>
      <Head contentTitle={contentTitle} seo={{ description }} />
      <div
        className="w-100 d-flex align-items-center justify-content-center bg-dark bg-gradient"
        style={{ height: '100vh' }}
      >
        <Card className="shadow-lg" style={{ maxWidth: 400 }}>
          <Card.Header className="fs-4">Password protected site</Card.Header>
          <Card.Body className="py-4">
            <Card.Subtitle className="mb-3">Please enter your password to get access.</Card.Subtitle>
            <Form className="d-flex gap-2" onSubmit={submit}>
              <CancelableFormControl
                type="password"
                value={enteredPassword}
                onChange={(e) => {
                  setEnteredPassword(e.target.value);
                  PasswordProtection.setPassword(e.target.value);
                }}
                onCancel={() => {
                  setEnteredPassword('');
                  PasswordProtection.setPassword('');
                }}
              />
              <Button variant={enteredPassword ? 'primary' : 'outline-primary'} type="submit">
                Submit
              </Button>
            </Form>
            {siteSettings?.data.site.siteMetadata.siteEnvironment === 'development' && (
              <div>
                <div className="d-flex my-2 gap-2">
                  <Form.Control type="text" value={PasswordProtection.passwordHash} disabled />
                  <IconButton
                    icon={copied ? EditorIcons.Check : EditorIcons.Copy}
                    variant="outline-primary"
                    onClick={copyHash}
                  />
                </div>
                <Form.Text className="text-muted">
                  Hash is only shown in development environment. Enter the password, copy the hash, open{' '}
                  <code>settings.yml</code> and paste as <code>sitePasswordHash</code>.
                </Form.Text>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
