import React from 'react';
import { uuid } from '../utils/utils';

export function useRefState<T>(initial: T): [React.MutableRefObject<T>, (value: T) => void, string] {
  const stateRef = React.useRef<T>(initial);
  const [renderId, setRenderId] = React.useState(uuid());
  const setState = React.useCallback((value: T) => {
    stateRef.current = value;
    setRenderId(uuid());
  }, []);
  return [stateRef, setState, renderId];
}
