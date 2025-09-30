import { Auth, User } from 'firebase/auth';
import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { EmailAuth } from './EmailAuth';

interface Props {
  show: boolean;
  setShow: (show: boolean) => void;
  auth: Auth;
  onSuccess?: (user: User) => void;
}

export const EmailAuthModal = (props: Props) => {
  const handleCloseModal = () => {
    props.setShow(false);
  };

  return (
    <Modal show={props.show} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Sign In With Email</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <EmailAuth auth={props.auth} onSuccess={props.onSuccess} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleCloseModal}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
