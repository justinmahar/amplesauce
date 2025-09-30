import { z } from 'genkit';
import { gemini } from '../config';
import { firestore } from '../../firebase/firebase-app';

// Types/Interfaces
export interface GetGeminiConfigOutput {
  apiKey: string;
  model: string;
}

// Stubbed export: replace with defineFlow during implementation
export const getGeminiConfigFlow = gemini.defineFlow(
  {
    name: 'getGeminiConfigFlow',
    outputSchema: z.object({
      apiKey: z.string(),
      model: z.string(),
    }),
  },
  async (): Promise<GetGeminiConfigOutput> => {
    const doc = await firestore.doc('genai/gemini').get();
    if (!doc.exists) {
      throw new Error('[getGeminiConfigFlow] AI configuration document not found (genai/gemini).');
    }
    const data = doc.data() as any;
    return {
      apiKey: data.apikey,
      model: data.model,
    };
  },
);
