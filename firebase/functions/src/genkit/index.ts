// Central registration point for Genkit flows and tools
// This ensures the Dev UI can discover flows/tools when running locally.

// Ensure Genkit is initialized
import { gemini } from './config';

// Export flows/tools for programmatic use in Firebase functions
// Flows
export { authenticateUserFlow } from './flows/authenticateUserFlow';
export { getGeminiConfigFlow } from './flows/getGeminiConfigFlow';
export { promptFlow as promptFlow } from './flows/promptFlow';
export { nicheHunterFlow } from './flows/nicheHunterFlow';

// Tools
