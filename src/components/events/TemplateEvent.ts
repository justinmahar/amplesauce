import EventEmitter from 'events';

export const XxxxxxxxxEvent = {
  TYPE: 'xxxxxxxxx-event',
  TITLE: 'Xxxxxxxxx',
  fire: (eventEmitter: EventEmitter): void => {
    eventEmitter.emit(XxxxxxxxxEvent.TYPE);
  },
};
