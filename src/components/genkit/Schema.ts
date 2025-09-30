export type Schema = {
  type?: 'string' | 'object' | 'number' | 'boolean' | 'array';
  description?: string;
  properties?: {
    [key: string]: Schema;
  };
  required?: string[];
  enum?: string[];
  items?: Schema;
  anyOf?: Schema[];
};
