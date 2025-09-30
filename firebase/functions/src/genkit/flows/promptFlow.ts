import { googleAI } from '@genkit-ai/googleai';

import { z } from 'genkit';
import { gemini } from '../config';
import { getGeminiConfigFlow } from './getGeminiConfigFlow';
import { GenkitMessage } from './GenkitMessage';
import { authenticateUserFlow } from './authenticateUserFlow';

// Types/Interfaces
export interface PromptFlowInput {
  prompt: string;
  userUid: string;
  authToken: string;
  schema?: string;
}

export interface PromptFlowOutput {
  output?: unknown;
  error?: string;
  trace?: string[];
}

// Stubbed export: replace with defineFlow during implementation
export const promptFlow = gemini.defineFlow(
  {
    name: 'promptFlow',
    inputSchema: z.object({
      prompt: z.string(),
      userUid: z.string(),
      authToken: z.string(),
      schema: z.string().optional(),
    }),
    outputSchema: z.object({
      output: z.any().optional(),
      error: z.string().optional(),
      trace: z.array(z.string()).optional(),
    }),
  },
  async (input): Promise<PromptFlowOutput> => {
    const trace: string[] = [];
    try {
      trace.push('Flow started');

      trace.push('Authenticating user...');
      const { userSettings } = await authenticateUserFlow({ userUid: input.userUid, authToken: input.authToken });
      trace.push('Authentication successful');

      trace.push('Getting Gemini config...');
      const { model } = await getGeminiConfigFlow();
      trace.push(`Gemini config loaded: ${model}`);

      trace.push('Calling Gemini API...');

      const messages: GenkitMessage[] = [
        {
          role: 'user',
          content: [{ text: input.prompt }],
        },
      ];

      const generation = await gemini.generate({
        model: googleAI.model(model),
        messages,
        tools: [],
        context: { userSettings },
        output: {
          jsonSchema: input.schema
            ? JSON.parse(input.schema)
            : {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    description: 'A string containing the response.',
                  },
                },
                required: ['message'],
              },
        },
      });
      trace.push('Gemini API call successful');

      trace.push('Ending flow...');

      return {
        output: generation.output,
        error: undefined,
        trace,
      };
    } catch (error) {
      trace.push(`Error: ${error}`);
      return { error: `${error}`, trace };
    }
  },
);
