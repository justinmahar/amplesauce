import { Schema } from './Schema';

// See: https://ai.google.dev/gemini-api/docs/structured-output

// NOTE: This schema is based on OpenAPI 3.0, which Gemini should support.

export const VideoSchema: Schema = {
  type: 'object',
  properties: {
    message: {
      type: 'string',
      description: 'A string containing the response.',
    },
  },
  required: ['message'],
};
