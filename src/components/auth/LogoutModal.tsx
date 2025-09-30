import { navigate } from 'gatsby-link';
import React, { JSX } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { PageRoutes } from '../pages/PageRoutes';

interface Props {
  show: boolean;
  setShow: (show: boolean) => void;
}

export const LogoutModal = ({ show, setShow }: Props): JSX.Element => {
  const logout = () => {
    navigate(PageRoutes.logout);
  };

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Logout</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to log out?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="danger"
          onClick={() => {
            logout();
            setShow(false);
          }}
        >
          Logout
        </Button>
        <Button variant="secondary" onClick={() => setShow(false)}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
