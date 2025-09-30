import { EventEmitter } from 'events';
import * as React from 'react';
import { ElementProps } from 'react-html-props';

const defaultEventEmitter: EventEmitter = new EventEmitter();

export const EventEmitterContext = React.createContext<EventEmitter>(defaultEventEmitter);

export function EventEmitterProvider({ children }: ElementProps): React.JSX.Element {
  return <EventEmitterContext.Provider value={defaultEventEmitter}>{children}</EventEmitterContext.Provider>;
}

export const useEventEmitterContext = (): EventEmitter => {
  return React.useContext(EventEmitterContext);
};
