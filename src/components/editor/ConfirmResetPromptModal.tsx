import classNames from 'classnames';
import React from 'react';
import { Button, Modal, ModalProps } from 'react-bootstrap';

export interface ConfirmResetPromptModalProps extends ModalProps {
  show: boolean;
  onCancel: () => void;
  onReset: () => void;
}

export const ConfirmResetPromptModal = ({ show, onCancel, onReset, ...modalProps }: ConfirmResetPromptModalProps) => {
  const focusButtonRef = React.useRef<HTMLButtonElement | null>(null);
  React.useEffect(() => {
    if (show) {
      focusButtonRef.current?.focus();
    }
  }, [show]);
  return (
    <Modal centered show={show} onHide={onCancel} {...modalProps} className={classNames(modalProps.className)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Reset</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Changes have been made. Reset?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onReset} ref={focusButtonRef}>
          Reset
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
