// AI initialization config
// Initializes AI and registers plugins. Import from here in flows/tools.
import { googleAI } from '@genkit-ai/googleai';
import dotenv from 'dotenv';
import { genkit } from 'genkit';
import openAI from 'genkitx-openai';

// Gemini
export const gemini = genkit({
  plugins: [googleAI()],
});

// ChatGPT
dotenv.config(); // Load environment variables
export const chatgpt = genkit({
  plugins: [openAI()],
});
