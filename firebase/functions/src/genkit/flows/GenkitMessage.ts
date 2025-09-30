import { MessageData, Part } from 'genkit';

export type GenkitMessage = MessageData & {
  content: Part[] | string | (string | Part)[];
};
