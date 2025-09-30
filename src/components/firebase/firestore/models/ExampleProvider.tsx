import * as React from 'react';
import { ElementProps } from 'react-html-props';
import { useUserAccountContext } from '../../../contexts/UserAccountProvider';
import { Example, useExample } from './Example';
import { DocLoader } from '../useDocLoader';

const defaultExample: DocLoader<Example> = {
  model: undefined,
  loading: false,
  snapshot: undefined,
  error: undefined,
};

export const ExampleContext = React.createContext<DocLoader<Example>>(defaultExample);

/**
 * Provider for user settings (retrieved from Firebase).
 *
 * Depends on the user account context.
 */
export function ExampleProvider({ children }: ElementProps): React.JSX.Element {
  const userAccountLoader = useUserAccountContext();
  const exampleLoader = useExample(userAccountLoader.user?.uid);
  return <ExampleContext.Provider value={exampleLoader}>{children}</ExampleContext.Provider>;
}

export const useExampleContext = (): DocLoader<Example> => {
  return React.useContext(ExampleContext);
};
