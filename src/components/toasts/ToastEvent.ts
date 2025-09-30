import EventEmitter from 'events';

export enum ToastPosition {
  topStart = 'top-start',
  topCenter = 'top-center',
  topEnd = 'top-end',
  middleStart = 'middle-start',
  middleCenter = 'middle-center',
  middleEnd = 'middle-end',
  bottomStart = 'bottom-start',
  bottomCenter = 'bottom-center',
  bottomEnd = 'bottom-end',
}

const defaultPosition = ToastPosition.topCenter;
const defaultAutohide = true;
const defaultDelay = 3000;
const defaultBg = 'light';

export const ToastEvent = {
  TYPE: 'toast-event',
  TITLE: 'Toast Event',
  fire: (eventEmitter: EventEmitter, options: ToastOptions): void => {
    eventEmitter.emit(ToastEvent.TYPE, {
      time: Date.now(),
      position: defaultPosition,
      autohide: defaultAutohide,
      delay: defaultDelay,
      bg: defaultBg,
      ...options,
    });
  },
  /** Show a 3-second toast in the top center with the title and message provided. */
  fireBasic: (
    eventEmitter: EventEmitter,
    title: string | undefined,
    message: string | undefined,
    options?: ToastOptions,
  ): void => {
    ToastEvent.fire(eventEmitter, {
      title,
      message,
      ...options,
    });
  },
};

export interface ToastOptions {
  /** Title of the toast. Leave undefined for no title. For more flexibility, use the headerContents option. */
  title?: string;
  /** The toast message. Leave undefined for no message. For more flexibility, use the bodyContents option. */
  message?: string;
  /** Position on the screen for the toast. Use `ToastPosition` enum. Default `top-center`. */
  position?: ToastPosition;
  /** True to automatically hide the toast after the delay elapses. Default true. */
  autohide?: boolean;
  /** True if this toast should remove all others in its position. Default false. */
  solo?: boolean;
  /** The amount of time before the toast is removed. Default 3000 millis. */
  delay?: number;
  /** The background color (use a Bootstrap variant such as primary, secondary, etc). Default `light`. */
  bg?: string;
  /** The header contents for the toast. Overrides the title option. */
  headerContents?: React.ReactNode;
  /** The body contents for the toast. Overrides the message option. */
  bodyContents?: React.ReactNode;
  /** True if a close button should be shown. Recommended if autohide is false. Default `false`. */
  closeButton?: boolean;
  /** The variant for the close button. Specify "white" when background is dark. */
  closeVariant?: 'white';
  /** The epoch time at which the toast occurred, in millis. Required for autohide. Defaults to `Date.now()`. */
  time?: number;
  /** Styles for the Toast. */
  style?: React.CSSProperties | undefined;
  /** Classes for the Toast. */
  className?: string;
}
