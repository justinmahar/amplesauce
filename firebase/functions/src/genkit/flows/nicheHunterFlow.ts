import { googleAI } from '@genkit-ai/googleai';
import { z } from 'genkit';
import { gemini } from '../config';
import { GenkitMessage } from './GenkitMessage';
import { authenticateUserFlow } from './authenticateUserFlow';
import { getGeminiConfigFlow } from './getGeminiConfigFlow';
import { logger } from 'firebase-functions/v1';

// Types/Interfaces
export type NicheStrategy = 'nicheDown' | 'nicheSideways';

export interface NicheHunterFlowInput {
  niche: string;
  strategy: NicheStrategy;
  limit?: number; // default 10
  userUid: string;
  authToken: string;
}

export type NicheScore = 0 | 1 | 2; // 0=low, 1=medium, 2=high

export interface NicheIdea {
  /** Name of the subniche or related niche */
  nm: string;
  /** Estimated revenue per mille (RPM) for monetized views */
  rp: number;
  /** Affiliate program strength: 0=low, 1=medium, 2=high */
  af: NicheScore;
  /** Sponsorship strength: 0=low, 1=medium, 2=high */
  sp: NicheScore;
  /** Estimated market size in thousands of people (K) */
  mk: number;
  /** Estimated monthly YouTube search volume for primary terms */
  mv: number;
  /** Saturation estimate: 0=low, 1=medium, 2=high (higher = more saturated) */
  st: NicheScore;
  /** Evergreen score: 0=low, 1=medium, 2=high */
  eg: NicheScore;
  /** Purchase power score: 0=low, 1=medium, 2=high */
  pp: NicheScore;
  /** Engagement score: 0=low, 1=medium, 2=high */
  en: NicheScore;
}

export interface NicheHunterFlowOutput {
  ideas: NicheIdea[];
  error?: string;
}

export const nicheHunterFlow = gemini.defineFlow(
  {
    name: 'nicheHunterFlow',
    inputSchema: z.object({
      niche: z.string(),
      strategy: z.enum(['nicheDown', 'nicheSideways']),
      limit: z.number().int().min(1).max(50).optional(),
      userUid: z.string(),
      authToken: z.string(),
    }),
    streamSchema: z.string(),
    outputSchema: z.object({
      ideas: z.array(z.any()),
    }),
  },
  async (input, { sendChunk }): Promise<NicheHunterFlowOutput> => {
    // (Reserved) Trace collection for future debugging
    const limit = input.limit ?? 10;
    const trace = (log: string) => {
      try {
        sendChunk(JSON.stringify({ type: 'trace', trace: log }));
      } catch {
        // no-op
      }
    };

    trace('Authenticating user...');
    await authenticateUserFlow({ userUid: input.userUid, authToken: input.authToken });
    trace('Authentication successful');

    // 2) Get Gemini config
    const { model } = await getGeminiConfigFlow();
    trace(`Gemini model: ${model}`);

    // 3) Build prompt and schema
    const prompt = `You are a niche ideation assistant for YouTube search-based video topics. Your goal is to generate niche ideas for a given niche.
Generate no more than ${limit} ${input.strategy === 'nicheDown' ? 'subniches (niche down)' : 'adjacent/similar niches (niche sideways)'} for the following niche: "${input.niche}"`;

    const jsonSchema = {
      type: 'object',
      description: 'Structured list of niche ideas.',
      properties: {
        ideas: {
          type: 'array',
          description: 'List of generated niche ideas',
          items: {
            type: 'object',
            properties: {
              nm: { type: 'string', description: 'Name of the niche' },
              rp: { type: 'number', description: 'Estimated revenue per mille (RPM) for monetized views' },
              af: { type: 'integer', minimum: 0, maximum: 2, description: 'Affiliate strength: 0=low,1=medium,2=high' },
              sp: {
                type: 'integer',
                minimum: 0,
                maximum: 2,
                description: 'Sponsorship strength: 0=low,1=medium,2=high',
              },
              mk: { type: 'number', description: 'Estimated market size in thousands of people (K)' },
              mv: { type: 'number', description: 'Estimated monthly YouTube search volume' },
              st: {
                type: 'integer',
                minimum: 0,
                maximum: 2,
                description: 'Saturation estimate: 0=low,1=medium,2=high (higher = more saturated)',
              },
              eg: { type: 'integer', minimum: 0, maximum: 2, description: 'Evergreen score: 0=low,1=medium,2=high' },
              pp: {
                type: 'integer',
                minimum: 0,
                maximum: 2,
                description: 'Purchase power score: 0=low,1=medium,2=high',
              },
              en: { type: 'integer', minimum: 0, maximum: 2, description: 'Engagement score: 0=low,1=medium,2=high' },
            },
            required: ['nm', 'rp', 'af', 'sp', 'mk', 'mv', 'st', 'eg', 'pp', 'en'],
          },
        },
      },
      required: ['ideas'],
    };

    // 4) Call Gemini
    const messages: GenkitMessage[] = [{ role: 'user', content: [{ text: prompt }] }];

    trace('Calling Gemini (stream)...');
    trace(`Prompt: ${prompt}`);
    trace(`JSON Schema: ${JSON.stringify(jsonSchema)}`);
    const { stream, response } = gemini.generateStream({
      model: googleAI.model(model),
      messages,
      // tools: [],
      context: {},
      output: { jsonSchema },
    });

    for await (const chunk of stream) {
      try {
        sendChunk(JSON.stringify({ type: 'output', output: chunk.output }));
      } catch (e) {
        logger.error(e);
        trace(`Error sending chunk: ${e}`);
      }
    }

    let output: NicheHunterFlowOutput = { ideas: [] };
    try {
      const generation = await response;
      output = generation?.output;
    } catch (e) {
      output = { error: `${e}`, ideas: [] };
      logger.error(e);
      trace(`Error getting response: ${e}`);
    }

    trace(`Completed with ${(output.ideas ?? []).length} ideas. Output was: ${JSON.stringify(output)}`);
    return output;
  },
);
