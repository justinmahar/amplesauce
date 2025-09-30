import classNames from 'classnames';
import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { DivProps } from 'react-html-props';
import { Subs } from 'react-sub-unsub';
import { useEventEmitterContext } from '../contexts/EventEmitterProvider';
import { ToastEvent, ToastOptions, ToastPosition } from './ToastEvent';

export interface ToastManagerProps extends DivProps {}

export const ToastManager = ({ ...divProps }: ToastManagerProps) => {
  const eventEmitter = useEventEmitterContext();

  const [toasts, setToasts] = React.useState<ToastOptions[]>([]);

  React.useEffect(() => {
    const toastEventListener = (options: ToastOptions) => {
      let newToasts = [...toasts];
      if (options.solo) {
        newToasts = newToasts.filter((toast) => toast.position !== options.position);
      }
      setToasts([...newToasts, options]);
    };
    const subs = new Subs();
    subs.subscribeEvent(eventEmitter, ToastEvent.TYPE, toastEventListener);
    return subs.createCleanup();
  }, [eventEmitter, toasts]);

  React.useEffect(() => {
    const subs = new Subs();

    const expiredToastIndices: number[] = [];
    // We're going to add a timeout for each toast that has autohide enabled, which removes the toast after a delay
    toasts.forEach((toast, index) => {
      if (!!toast.autohide && typeof toast.time === 'number' && typeof toast.delay === 'number' && toast.delay >= 0) {
        const now = Date.now();
        // First check if any toasts are already expired, and add to a list we'll process later
        if (now >= toast.time + toast.delay) {
          expiredToastIndices.push(index);
        } else {
          // Add a timeout that deletes the toast after the specified time
          subs.setTimeout(
            () => {
              const newToasts = [...toasts];
              newToasts.splice(index, 1);
              setToasts(newToasts);
            },
            Math.max(0, toast.time + toast.delay - now),
          );
        }
      }
    });

    // If there were expired toasts, remove them
    if (expiredToastIndices.length > 0) {
      const newToasts = [...toasts];
      // Sort array by largest index first and remove the expired toasts
      expiredToastIndices.sort((a, b) => b - a).forEach((i) => newToasts.splice(i, 1));
      setToasts(newToasts);
    }

    return subs.createCleanup();
  }); // No deps array -- we want this to run on every render

  const toastElements = toasts.map((toast, index) => {
    const onClose = () => {
      const newToasts = [...toasts];
      newToasts.splice(index, 1);
      setToasts(newToasts);
    };
    return (
      <Toast
        key={`toast-${index}-${toast.time}`}
        bg={toast.bg}
        onClose={onClose}
        className={toast.className}
        style={{ pointerEvents: 'auto', ...toast.style }}
      >
        {(toast.headerContents || toast.title) && (
          <Toast.Header closeButton={toast.closeButton ?? false} closeVariant={toast.closeVariant}>
            {toast.headerContents ?? <span className="fw-bold">{toast.title}</span>}
          </Toast.Header>
        )}
        {(toast.bodyContents || toast.message) && <Toast.Body>{toast.bodyContents ?? toast.message}</Toast.Body>}
      </Toast>
    );
  });

  const toastContainerClassName = 'p-3';

  return (
    <div
      {...divProps}
      className={classNames('position-fixed p-0 m-0 top-0 start-0 vw-100 vh-100', divProps.className)}
      style={{ zIndex: 10000, pointerEvents: 'none', ...divProps.style }}
    >
      <ToastContainer className={toastContainerClassName} position={ToastPosition.topStart}>
        {toastElements.filter((_val, index) => toasts[index].position === ToastPosition.topStart)}
      </ToastContainer>
      <ToastContainer className={toastContainerClassName} position={ToastPosition.topCenter}>
        {toastElements.filter(
          (_val, index) => !toasts[index].position || toasts[index].position === ToastPosition.topCenter,
        )}
      </ToastContainer>
      <ToastContainer className={toastContainerClassName} position={ToastPosition.topEnd}>
        {toastElements.filter((_val, index) => toasts[index].position === ToastPosition.topEnd)}
      </ToastContainer>
      <ToastContainer className={toastContainerClassName} position={ToastPosition.middleStart}>
        {toastElements.filter((_val, index) => toasts[index].position === ToastPosition.middleStart)}
      </ToastContainer>
      <ToastContainer className={toastContainerClassName} position={ToastPosition.middleCenter}>
        {toastElements.filter((_val, index) => toasts[index].position === ToastPosition.middleCenter)}
      </ToastContainer>
      <ToastContainer className={toastContainerClassName} position={ToastPosition.middleEnd}>
        {toastElements.filter((_val, index) => toasts[index].position === ToastPosition.middleEnd)}
      </ToastContainer>
      <ToastContainer className={toastContainerClassName} position={ToastPosition.bottomStart}>
        {toastElements.filter((_val, index) => toasts[index].position === ToastPosition.bottomStart)}
      </ToastContainer>
      <ToastContainer className={toastContainerClassName} position={ToastPosition.bottomCenter}>
        {toastElements.filter((_val, index) => toasts[index].position === ToastPosition.bottomCenter)}
      </ToastContainer>
      <ToastContainer className={toastContainerClassName} position={ToastPosition.bottomEnd}>
        {toastElements.filter((_val, index) => toasts[index].position === ToastPosition.bottomEnd)}
      </ToastContainer>
    </div>
  );
};
