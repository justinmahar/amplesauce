import * as React from 'react';
import { ElementProps } from 'react-html-props';

type TemplateType = string;
const defaultValue: TemplateType = 'example';

export const TemplateContext = React.createContext<TemplateType>(defaultValue);

export function TemplateProvider({ children }: ElementProps): React.JSX.Element {
  return <TemplateContext.Provider value={defaultValue}>{children}</TemplateContext.Provider>;
}

export const useTemplateContext = (): TemplateType => {
  return React.useContext(TemplateContext);
};
