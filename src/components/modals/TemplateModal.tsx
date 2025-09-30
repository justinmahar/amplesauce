import React, { JSX } from 'react';
import { Button, Modal, ModalProps } from 'react-bootstrap';
import { Subs } from 'react-sub-unsub';

interface Props extends ModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
  okHandler?: () => void;
  cancelHandler?: () => void;
}

export const TemplateModal = ({
  show,
  setShow,
  okHandler: propsOkHandler,
  cancelHandler: propsCancelHandler,
  ...props
}: Props): JSX.Element => {
  const okHandler = propsOkHandler ? propsOkHandler : () => setShow(false);
  const cancelHandler = propsCancelHandler ? propsCancelHandler : () => setShow(false);
  const focusButtonRef = React.useRef<HTMLButtonElement | null>(null);
  React.useEffect(() => {
    const subs = new Subs();
    subs.setTimeout(() => {
      focusButtonRef.current?.focus();
    }, 0);
    return subs.createCleanup();
  }, []);
  return (
    <Modal size="lg" centered show={show} onHide={cancelHandler} {...props}>
      <Modal.Header closeButton>
        <Modal.Title>Modal Title</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>Modal body goes here</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={okHandler} ref={focusButtonRef}>
          OK
        </Button>
        <Button variant="secondary" onClick={cancelHandler}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
