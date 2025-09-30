import {
  Auth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
  User,
} from 'firebase/auth';
import React, { JSX } from 'react';
import { Alert, Button, Form, Stack } from 'react-bootstrap';
import { useUserAccountContext } from '../contexts/UserAccountProvider';

interface Props {
  auth: Auth;
  onSuccess?: (user: User) => void;
  onFailure?: (error: any) => Promise<void> | void;
}

const minPasswordLength = 6;

export const EmailAuth = (props: Props): JSX.Element => {
  const [viewState, setViewState] = React.useState('sign-in');
  const [passwordFail, setPasswordFail] = React.useState(false);

  const [enteredEmail, setEnteredEmail] = React.useState('');
  const [enteredFullName, setEnteredFullName] = React.useState('');
  const [enteredPassword, setEnteredPassword] = React.useState('');

  const [createAccountErrorMessage, setCreateAccountErrorMessage] = React.useState('');
  const [signInErrorMessage, setSignInErrorMessage] = React.useState('');
  const [recoverPasswordErrorMessage, setRecoverPasswordErrorMessage] = React.useState('');

  const userAccountLoader = useUserAccountContext();

  const onSuccess = props.onSuccess || (() => undefined);
  const onFailure = props.onFailure || (() => undefined);

  const handleSignIntoExistingAccountSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signInWithEmailAndPassword(props.auth, enteredEmail, enteredPassword)
      .then((userCredential) => {
        const user = userCredential.user;
        onSuccess(user);
        setEnteredEmail('');
        setEnteredFullName('');
        setEnteredPassword('');
      })
      .catch((error) => {
        console.error(error);
        let message = `${error}`;
        if (message.includes('user-not-found')) {
          message = 'No account with that email exists.';
        } else if (message.includes('wrong-password')) {
          message = 'Invalid password.';
        } else if (message.includes('too-many-requests')) {
          message =
            'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.';
        }
        setEnteredPassword('');
        setSignInErrorMessage(message);
      });
  };

  const handleCreateAccountSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const passwordPasses =
      enteredPassword.length >= minPasswordLength &&
      /[a-zA-Z]/.test(enteredPassword) &&
      (/\d/.test(enteredPassword) || /[\s~`!@#$%^&*+=\-[\]\\';,/{}|":<>?()._]/.test(enteredPassword));
    setPasswordFail(!passwordPasses);
    if (passwordPasses) {
      createUserWithEmailAndPassword(props.auth, enteredEmail, enteredPassword)
        .then((userCredential) => {
          const user = userCredential.user;
          updateProfile(user, {
            displayName: enteredFullName,
          }).then(() => {
            onSuccess(user);
            setEnteredEmail('');
            setEnteredFullName('');
            setEnteredPassword('');
          });
        })
        .catch((error) => {
          console.error(error);
          let message = `${error}`;
          if (message.includes('email-already-in-use')) {
            message = 'That email is already in use. Try signing in.';
          }
          setEnteredPassword('');
          setCreateAccountErrorMessage(message);
        });
    }
  };

  const handleRecoverPasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendPasswordResetEmail(props.auth, enteredEmail)
      .then(() => {
        // Password reset email sent!
        // ..
        setViewState('check-email');
        setEnteredPassword('');
      })
      .catch((error) => {
        console.error(error);
        let message = `${error}`;
        if (message.includes('user-not-found')) {
          message = 'No account with that email exists.';
        }
        setRecoverPasswordErrorMessage(message);
      });
  };

  return (
    <div>
      {viewState === 'sign-in' && (
        <div>
          <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
            <h5 className="my-0">Account Sign-In</h5>
            <Button variant="link" className="text-nowrap invisible" onClick={() => setViewState('sign-in')}>
              &laquo; Back
            </Button>
          </div>
          <Form onSubmit={handleSignIntoExistingAccountSubmit}>
            <Stack gap={2}>
              <Form.Group controlId="form-group-email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  required
                  value={enteredEmail}
                  onChange={(e) => setEnteredEmail(e.target.value)}
                  disabled={userAccountLoader.loading}
                />
              </Form.Group>
              <Form.Group controlId="form-group-password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  required
                  value={enteredPassword}
                  onChange={(e) => setEnteredPassword(e.target.value)}
                  disabled={userAccountLoader.loading}
                />
              </Form.Group>
              <div className="d-flex justify-content-between align-items-center gap-2">
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => {
                    setViewState('recover-password');
                    setEnteredEmail(enteredEmail);
                  }}
                  disabled={userAccountLoader.loading}
                >
                  Trouble signing in?
                </Button>
                <Button variant="dark" type="submit" disabled={userAccountLoader.loading}>
                  Sign In
                </Button>
              </div>
              {signInErrorMessage && (
                <Alert variant="danger" dismissible className="mb-0" onClose={() => setSignInErrorMessage('')}>
                  <div>{signInErrorMessage}</div>
                </Alert>
              )}
              <div className="d-flex justify-content-center mt-2">
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setViewState('create')}
                  disabled={userAccountLoader.loading}
                >
                  Create New Account
                </Button>
              </div>
            </Stack>
          </Form>
        </div>
      )}
      {viewState === 'create' && (
        <div>
          <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
            <h5 className="my-0">Create New Account</h5>
            <Button variant="link" className="text-nowrap" onClick={() => setViewState('sign-in')}>
              &laquo; Back
            </Button>
          </div>
          <Form onSubmit={handleCreateAccountSubmit}>
            <Stack gap={2}>
              <Form.Group controlId="form-group-email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  required
                  value={enteredEmail}
                  onChange={(e) => setEnteredEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="form-group-full-name">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  required
                  value={enteredFullName}
                  onChange={(e) => setEnteredFullName(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="form-group-password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  minLength={minPasswordLength}
                  required
                  value={enteredPassword}
                  onInvalid={() => setPasswordFail(true)}
                  onChange={(e) => {
                    setPasswordFail(false);
                    setEnteredPassword(e.target.value);
                  }}
                />
                {passwordFail && (
                  <Form.Text className="text-danger">
                    Strong passwords have at least 6 characters and a mix of letters, numbers, and symbols
                  </Form.Text>
                )}
              </Form.Group>
              <div className="d-flex justify-content-end align-items-center gap-2">
                <Button variant="dark" type="submit">
                  Create Account
                </Button>
              </div>
              {createAccountErrorMessage && (
                <Alert variant="danger" dismissible onClose={() => setCreateAccountErrorMessage('')}>
                  <div>{createAccountErrorMessage}</div>
                </Alert>
              )}
            </Stack>
          </Form>
        </div>
      )}
      {viewState === 'recover-password' && (
        <div>
          <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
            <h5 className="my-0">Recover Password</h5>
            <Button variant="link" className="text-nowrap" onClick={() => setViewState('sign-in')}>
              &laquo; Back
            </Button>
          </div>
          <Form onSubmit={handleRecoverPasswordSubmit}>
            <p>Get instructions sent to this email that explain how to reset your password.</p>
            <Stack gap={2}>
              <Form.Group controlId="form-group-email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  required
                  value={enteredEmail}
                  onChange={(e) => {
                    setRecoverPasswordErrorMessage('');
                    setEnteredEmail(e.target.value);
                  }}
                />
              </Form.Group>
              <div className="d-flex justify-content-end align-items-center gap-2">
                <Button variant="primary" type="submit">
                  Send
                </Button>
              </div>
              {recoverPasswordErrorMessage && (
                <Alert variant="danger" dismissible onClose={() => setRecoverPasswordErrorMessage('')}>
                  <div>{recoverPasswordErrorMessage}</div>
                </Alert>
              )}
            </Stack>
          </Form>
        </div>
      )}
      {viewState === 'check-email' && (
        <div>
          <div className="d-flex align-items-center mb-3">
            <h5 className="my-0">Check Your Email</h5>
          </div>
          <p>
            Follow the instructions sent to <span className="fw-bold">{enteredEmail}</span> to recover your password.
          </p>
          <div className="d-flex justify-content-end align-items-center gap-2">
            <Button
              variant="primary"
              type="submit"
              onClick={() => {
                setEnteredEmail(enteredEmail);
                setViewState('sign-in');
              }}
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
