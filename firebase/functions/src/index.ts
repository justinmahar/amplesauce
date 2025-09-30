import { onCallGenkit } from 'firebase-functions/https';
import { defineSecret } from 'firebase-functions/params';
import './genkit';
import { promptFlow } from './genkit';

// === Scheduled functions === === === === === === === === === === === ===
// export * from './scheduled-functions';

// === Auth endpoints === === === === === === === === === === === ===

// === Https endpoints === === === === === === === === === === === ===
export * from './https-functions';

// === Genkit endpoints === === === === === === === === === === === ===
const geminiApiKey = defineSecret('GEMINI_API_KEY');
export const prompt = onCallGenkit({ secrets: [geminiApiKey] }, promptFlow);
