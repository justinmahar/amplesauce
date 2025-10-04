import { onCallGenkit } from 'firebase-functions/https';
import { defineSecret } from 'firebase-functions/params';
import './genkit';
import { promptFlow as geminiPromptFlow, nicheHunterFlow, researchFlow } from './genkit';

// === Scheduled functions === === === === === === === === === === === ===
// export * from './scheduled-functions';

// === Auth endpoints === === === === === === === === === === === ===
export { onDeleteUser } from './auth/onDeleteUser';

// === Https endpoints === === === === === === === === === === === ===
export { setupUser } from './https/setupUser';
export { createWorkspace } from './https/createWorkspace';

// === Genkit endpoints === === === === === === === === === === === ===
const geminiApiKey = defineSecret('GEMINI_API_KEY');
export const prompt = onCallGenkit({ secrets: [geminiApiKey] }, geminiPromptFlow);
export const nicheHunter = onCallGenkit({ secrets: [geminiApiKey], timeoutSeconds: 120 }, nicheHunterFlow);
export const research = onCallGenkit({ secrets: [geminiApiKey], timeoutSeconds: 120 }, researchFlow);
