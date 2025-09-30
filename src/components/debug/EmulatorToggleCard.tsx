import { FaFire } from 'react-icons/fa';
import * as React from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { DivPropsWithoutRef } from 'react-html-props';

export interface EmulatorToggleCardProps extends DivPropsWithoutRef {}

export default function EmulatorToggleCard(props: EmulatorToggleCardProps) {
  const [toggleTime, setToggleTime] = React.useState(0);
  const [functionsEmulatorEnabled, setFunctionsEmulatorEnabled] = React.useState(true);
  const [authEmulatorEnabled, setAuthEmulatorEnabled] = React.useState(false);
  const [firestoreEmulatorEnabled, setFirestoreEmulatorEnabled] = React.useState(false);

  const handleFunctionsEmulatorToggle = () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(
        'functions-emulator-enabled',
        localStorage['functions-emulator-enabled'] !== 'false' ? 'false' : 'true',
      );
      setToggleTime(Date.now());
    }
  };

  const handleAuthEmulatorToggle = () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(
        'auth-emulator-enabled',
        localStorage['auth-emulator-enabled'] === 'true' ? 'false' : 'true',
      );
      setToggleTime(Date.now());
    }
  };
  const handleFirestoreEmulatorToggle = () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(
        'firestore-emulator-enabled',
        localStorage['firestore-emulator-enabled'] === 'true' ? 'false' : 'true',
      );
      setToggleTime(Date.now());
    }
  };

  React.useEffect(() => {
    setFunctionsEmulatorEnabled(localStorage.getItem('functions-emulator-enabled') !== 'false');
    setAuthEmulatorEnabled(localStorage.getItem('auth-emulator-enabled') === 'true');
    setFirestoreEmulatorEnabled(localStorage.getItem('firestore-emulator-enabled') === 'true');
  }, [toggleTime]);

  return (
    <Card {...props}>
      <Card.Header>Emulators</Card.Header>
      <Card.Body>
        <Form.Check
          onChange={() => handleFunctionsEmulatorToggle()}
          label={'Functions Emulator'}
          checked={functionsEmulatorEnabled}
          className="user-select-none"
          id="emulatorFunctionsEnabled"
        />
        <Form.Check
          onChange={() => handleAuthEmulatorToggle()}
          label={'Auth Emulator'}
          checked={authEmulatorEnabled}
          className="user-select-none"
          id="emulatorAuthEnabled"
        />
        <Form.Check
          onChange={() => handleFirestoreEmulatorToggle()}
          label={'Firestore Emulator'}
          checked={firestoreEmulatorEnabled}
          className="user-select-none"
          id="emulatorFirestoreEnabled"
        />
        <p className="text-muted d-flex align-items-center mb-1">
          Browser refresh required to apply settings.
          <Button variant="link" size="sm" onClick={() => typeof window !== 'undefined' && window.location.reload()}>
            Refresh
          </Button>
        </p>
        <Button
          variant="link"
          className="px-0 py-0"
          onClick={() => typeof window !== 'undefined' && window.open('http://localhost:4000', '_blank')}
        >
          <FaFire className="text-warning me-2" />
          Firebase Emulator Suite
        </Button>
      </Card.Body>
    </Card>
  );
}
