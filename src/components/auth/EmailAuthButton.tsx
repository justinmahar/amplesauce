import { IconType } from 'react-icons';
import { FaEnvelope } from 'react-icons/fa';
import { Auth, AuthError, User } from 'firebase/auth';
import React, { JSX } from 'react';
import { ButtonProps } from 'react-bootstrap';
import { IconButton } from '../misc/IconButton';
import { EmailAuthModal } from './EmailAuthModal';

interface Props extends ButtonProps {
  auth: Auth;
  icon?: IconType;
  onSuccess?: (user: User) => void;
  onFailure?: (error: AuthError) => Promise<void> | void;
}

export const EmailAuthButton = ({ onSuccess, onFailure, auth, icon, ...buttonProps }: Props): JSX.Element => {
  const [showEmailAuthModal, setShowEmailAuthModal] = React.useState(false);

  const handleClickEmailSignIn = () => {
    setShowEmailAuthModal(true);
  };

  return (
    <>
      {showEmailAuthModal && (
        <EmailAuthModal show={showEmailAuthModal} setShow={setShowEmailAuthModal} auth={auth} onSuccess={onSuccess} />
      )}
      <IconButton
        {...buttonProps}
        icon={icon || FaEnvelope}
        onClick={(e) => {
          handleClickEmailSignIn();
          if (buttonProps.onClick) {
            buttonProps.onClick(e);
          }
        }}
      >
        {buttonProps.children || 'Sign in with email'}
      </IconButton>
    </>
  );
};
