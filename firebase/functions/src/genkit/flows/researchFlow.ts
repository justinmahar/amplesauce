import { googleAI } from '@genkit-ai/googleai';
import { z } from 'genkit';
import { gemini } from '../config';
import { authenticateUserFlow } from './authenticateUserFlow';
import { getGeminiConfigFlow } from './getGeminiConfigFlow';

// Examples: https://github.com/firebase/genkit/blob/96591062e16daef1b7fdb93a23eba486c0c26b3f/samples/js-gemini/src/index.ts#L101

export const researchFlow = gemini.defineFlow(
  {
    name: 'researchFlow',
    inputSchema: z.object({
      idea: z.string().describe('The YouTube video idea/topic to research.'),
      userUid: z.string().describe('Firebase User UID for authentication.'),
      authToken: z.string().describe('Firebase authentication token.'),
    }),
    outputSchema: z.any(),
  },
  async (input, { sendChunk, ...raw }) => {
    const trace = (log: string) => sendChunk(JSON.stringify({ type: 'trace', trace: log }));

    try {
      trace('Flow started');
      trace('Authenticating user...');
      await authenticateUserFlow({ userUid: input.userUid, authToken: input.authToken });
      trace('Authentication successful');

      trace('Loading Gemini config...');
      const { model } = await getGeminiConfigFlow();
      trace(`Gemini model: ${model}`);

      const prompt = `You are a research assistant. Research the following YouTube video idea and collect information that would be useful for creating the video. Summarize key facts, outline sections, suggest talking points, and collect relevant supporting information. Provide citations where possible.

Idea: "${input.idea}"
`;

      trace('Calling Gemini with Google Search grounding...');

      const { text, raw } = await gemini.generate({
        model: googleAI.model(model),
        prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      // Return both text and grounding metadata when available
      const output: unknown = {
        text,
        groundingMetadata: (raw as any)?.candidates[0]?.groundingMetadata,
      };
      trace('Flow completed');
      return output;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      trace(`Error: ${message}`);
      return { error: message } as unknown;
    }
  },
);
