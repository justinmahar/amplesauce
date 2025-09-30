import { googleAI } from '@genkit-ai/googleai';
import { z } from 'genkit';
import { gemini } from '../config';
import { GenkitMessage } from './GenkitMessage';
import { authenticateUserFlow } from './authenticateUserFlow';
import { getGeminiConfigFlow } from './getGeminiConfigFlow';

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
    outputSchema: z.object({
      ideas: z.array(
        z.object({
          nm: z.string().describe('Name of the subniche or related niche'),
          rp: z.number().describe('Estimated RPM for monetized views'),
          af: z.number().int().min(0).max(2).describe('Affiliate strength: 0=low,1=medium,2=high'),
          sp: z.number().int().min(0).max(2).describe('Sponsorship strength: 0=low,1=medium,2=high'),
          mk: z.number().describe('Estimated market size in thousands (K)'),
          mv: z.number().describe('Estimated monthly YouTube search volume'),
          st: z.number().int().min(0).max(2).describe('Saturation: 0=low,1=medium,2=high (higher = more saturated)'),
          eg: z.number().int().min(0).max(2).describe('Evergreen: 0=low,1=medium,2=high'),
          pp: z.number().int().min(0).max(2).describe('Purchase power: 0=low,1=medium,2=high'),
          en: z.number().int().min(0).max(2).describe('Engagement: 0=low,1=medium,2=high'),
        }),
      ),
    }),
  },
  async (input): Promise<NicheHunterFlowOutput> => {
    // (Reserved) Trace collection for future debugging
    const limit = input.limit ?? 10;
    // 1) Authenticate user
    await authenticateUserFlow({ userUid: input.userUid, authToken: input.authToken });

    // 2) Get Gemini config
    const { model } = await getGeminiConfigFlow();

    // 3) Build prompt and schema
    const prompt = `You are a niche ideation assistant for YouTube search-based video topics. Your goal is to generate niche ideas for a given niche and strategy, with a focus on the highest RPM (revenue per mille) and engagement opportunities. 
Generate ${limit} ${input.strategy === 'nicheDown' ? 'subniches (niche down)' : 'adjacent/similar niches (niche sideways)'} for the niche: "${input.niche}".

Rules:
- Output strictly as JSON that conforms to the provided schema.
- Provide reasonable numeric estimates based on publicly observable signals.
- Scores use 0=low, 1=medium, 2=high.
- Do not add fields not in the schema. Do not include commentary.
`;

    const jsonSchema = {
      type: 'object',
      description:
        'Structured list of niche ideas with short 2-letter property names. Comments describe each field in detail.',
      properties: {
        ideas: {
          type: 'array',
          description: 'List of generated niche ideas',
          items: {
            type: 'object',
            properties: {
              nm: { type: 'string', description: 'Name of the subniche or related niche' },
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
            additionalProperties: false,
          },
          minItems: limit,
          maxItems: limit,
        },
      },
      required: ['ideas'],
      additionalProperties: false,
    } as const;

    // 4) Call Gemini
    const messages: GenkitMessage[] = [{ role: 'user', content: [{ text: prompt }] }];

    const generation = await gemini.generate({
      model: googleAI.model(model),
      messages,
      tools: [],
      context: {},
      output: { jsonSchema },
    });

    const ideas = (generation.output as unknown as { ideas?: NicheIdea[] })?.ideas ?? [];
    return { ideas };
  },
);
