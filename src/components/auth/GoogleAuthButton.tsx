import { Auth, getRedirectResult, GoogleAuthProvider, signInWithRedirect, User } from 'firebase/auth';
import React, { JSX } from 'react';
import { Alert, ButtonProps } from 'react-bootstrap';
import { IconType } from 'react-icons';
import { FaGoogle } from 'react-icons/fa';
import { IconButton } from '../misc/IconButton';

interface Props extends ButtonProps {
  auth: Auth;
  icon?: IconType;
  onSuccess?: (user: User) => void;
}

export const GoogleAuthButton = ({ onSuccess, auth, icon, ...buttonProps }: Props): JSX.Element => {
  const [loginError, setLoginError] = React.useState<any>(undefined);

  const doOnSuccess = onSuccess || (() => undefined);

  const onLoginFailure = (error: any): void => {
    setLoginError(error);
  };

  const handleClickGoogleSignIn = () => {
    const googleAuthProvider = new GoogleAuthProvider();
    googleAuthProvider.setCustomParameters({
      // Forces account selection even when one account is available.
      prompt: 'select_account',
    });
    signInWithRedirect(auth, googleAuthProvider);
  };

  React.useEffect(() => {
    // This is called when redirected back to login from Firebase
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          doOnSuccess(result.user);
        }
      })
      .catch((error) => {
        console.error(error);
        onLoginFailure(error);
      });
  }, []);

  return (
    <>
      {loginError && (
        <Alert variant="danger" className="my-2">
          Error logging in: {`${loginError}`}
        </Alert>
      )}
      <IconButton
        {...buttonProps}
        icon={icon || FaGoogle}
        onClick={(e) => {
          handleClickGoogleSignIn();
          if (buttonProps.onClick) {
            buttonProps.onClick(e);
          }
        }}
      >
        Sign in with Google
      </IconButton>
    </>
  );
};
