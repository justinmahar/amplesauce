import { Auth, GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import React, { JSX } from 'react';
import { Alert, ButtonProps } from 'react-bootstrap';
import { IconType } from 'react-icons';
import { FaGoogle } from 'react-icons/fa';
import { IconButton } from '../misc/IconButton';

interface Props extends ButtonProps {
  auth: Auth;
  icon?: IconType;
  onSuccess?: (user: User) => void;
  onFailure?: (error: any) => void;
}

export const CustomGoogleAuthButton = ({ onSuccess, onFailure, auth, icon, ...buttonProps }: Props): JSX.Element => {
  const [loginError, setLoginError] = React.useState<any>(undefined);

  const doOnSuccess = onSuccess || (() => undefined);
  const doOnFailure = onFailure || (() => undefined);

  const handleClickGoogleSignIn = () => {
    const googleAuthProvider = new GoogleAuthProvider();
    googleAuthProvider.setCustomParameters({
      // Forces account selection even when one account is available.
      prompt: 'select_account',
    });

    signInWithPopup(auth, googleAuthProvider)
      .then((result) => {
        doOnSuccess(result.user);
      })
      .catch((error) => {
        console.error(error);
        setLoginError(error);
        doOnFailure(error);
      });
  };

  return (
    <>
      {loginError && (
        <Alert variant="danger" className="my-2">
          Error logging in: {`${loginError.message || loginError}`}
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
