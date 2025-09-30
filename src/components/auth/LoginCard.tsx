import classNames from 'classnames';
import { navigate } from 'gatsby-link';
import React, { JSX } from 'react';
import { Button, Card, CardProps, Spinner, Stack } from 'react-bootstrap';
import { PageRoutes } from '../pages/PageRoutes';
import { useUserAccountContext } from '../contexts/UserAccountProvider';
import { useUserSettingsContext } from '../contexts/UserSettingsProvider';
import { auth } from '../firebase/firebase-app';
import { CustomGoogleAuthButton } from './CustomGoogleAuthButton';
import { TemplateText } from '../template-tags/TemplateText';

interface LoginCardProps extends CardProps {
  onSuccess?: () => void;
  onFailure?: (error: any) => void;
}

export default function LoginCard({ onSuccess, onFailure, ...cardProps }: LoginCardProps): JSX.Element {
  const userSettingsLoader = useUserSettingsContext();
  const userAccountLoader = useUserAccountContext();
  const user = userAccountLoader.user;

  const doOnSuccess = onSuccess || (() => undefined);
  const doOnFailure = onFailure || (() => undefined);

  return (
    <Card {...cardProps} className={classNames('shadow', cardProps.className)}>
      <Card.Body>
        <Stack className="align-items-center mt-2">
          <h3 className="text-center">
            <TemplateText text="{siteName}" /> Login
          </h3>
          <div className="p-4">
            {!user && auth && userAccountLoader.loading && (
              <div className="d-flex align-items-center justify-content-center mb-3">
                <Spinner animation="border" role="status" />
              </div>
            )}
            {!user && auth && (
              <Stack gap={1}>
                <CustomGoogleAuthButton variant="primary" auth={auth} onSuccess={doOnSuccess} onFailure={doOnFailure} />
              </Stack>
            )}
            {user && (
              <Stack gap={2} className="align-items-center">
                {userSettingsLoader.loading && (
                  <div className="d-flex justify-content-center mb-3">
                    <Spinner animation="border" role="status" size="sm" />
                  </div>
                )}
                {!userSettingsLoader.loading && (
                  <p className="text-center">
                    You are logged in as {userSettingsLoader.userSettings?.getDisplayName()}
                  </p>
                )}
                <div className="d-flex gap-2">
                  <Button variant="link" onClick={() => navigate(PageRoutes.logout)}>
                    Logout
                  </Button>
                  <Button variant="light" onClick={() => navigate(PageRoutes.index)}>
                    Home &raquo;
                  </Button>
                </div>
              </Stack>
            )}
          </div>
        </Stack>
      </Card.Body>
    </Card>
  );
}
