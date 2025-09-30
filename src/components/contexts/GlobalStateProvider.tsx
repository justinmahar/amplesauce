import * as React from 'react';
import { useRefState } from '../hooks/useRefState';

interface GlobalStateValue {
  example: string;
}

interface GlobalState {
  value: GlobalStateValue;
  setState: (newValue: GlobalStateValue) => void;
}
const defaultState: GlobalState = {
  value: {
    example: 'example',
  },
  setState: () => undefined,
};

export const GlobalStateContext = React.createContext<GlobalState>(defaultState);

export interface GlobalStateProviderProps {
  children?: any;
}

export function GlobalStateProvider(props: GlobalStateProviderProps): React.JSX.Element {
  const [globalState, setGlobalState, renderId] = useRefState<GlobalStateValue>(defaultState.value);

  const state = React.useMemo(
    (): GlobalState => ({
      value: globalState.current,
      setState: (newValue) => setGlobalState(newValue),
    }),
    [renderId], // Include renderId only
  );

  return (
    <GlobalStateContext.Provider value={state}>
      <div>{props.children}</div>
    </GlobalStateContext.Provider>
  );
}

export const useGlobalStateContext = (): GlobalState => {
  return React.useContext(GlobalStateContext);
};
