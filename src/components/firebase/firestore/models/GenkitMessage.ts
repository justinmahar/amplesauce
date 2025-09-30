export enum Role {
  system = 'system',
  user = 'user',
  model = 'model',
  tool = 'tool',
}

export interface TextPart {
  text: string;
}

export interface ToolRequestPart {
  toolRequest: {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    input: Record<string, any>;
  };
}

export interface ToolResponsePart {
  toolResponse: {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    output: Record<string, any>;
  };
}

export type Part = TextPart | ToolRequestPart | ToolResponsePart;

export interface GenkitMessage {
  role: Role;
  content: (Part | string)[];
}
