import classNames from 'classnames';
import React from 'react';
import { Button, Modal, ModalProps } from 'react-bootstrap';

export interface DiscardChangesPromptModalProps extends ModalProps {
  show: boolean;
  onCancel: () => void;
  onDiscard: () => void;
}

export const DiscardChangesPromptModal = ({
  show,
  onCancel,
  onDiscard,
  ...modalProps
}: DiscardChangesPromptModalProps) => {
  const focusButtonRef = React.useRef<HTMLButtonElement | null>(null);
  React.useEffect(() => {
    if (show) {
      focusButtonRef.current?.focus();
    }
  }, [show]);
  return (
    <Modal centered show={show} onHide={onCancel} {...modalProps} className={classNames(modalProps.className)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Discard</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Changes have been made. Discard?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onDiscard} ref={focusButtonRef}>
          Discard
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
