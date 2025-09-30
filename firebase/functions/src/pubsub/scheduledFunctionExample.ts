import * as functionsV1 from 'firebase-functions/v1';

// Scheduled function example
export const exampleScheduledFunction = functionsV1.pubsub.schedule('every 30 minutes').onRun(async (context) => {
  // Implement your scheduled function here
  return null;
});
