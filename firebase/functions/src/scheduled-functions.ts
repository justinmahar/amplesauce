import { logger, pubsub } from 'firebase-functions/v1';
import { cleanUpMain } from './operations/main';

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// --- Scheduled Functions --- --- --- --- --- --- --- --- --- --- ---
// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

/**
 * Cleanup function that discards expired items every so often.
 */
export const scheduledCleanUp = pubsub.schedule('never' /* 'every 24 hours' */).onRun(async (context) => {
  try {
    // ==================
    // ==> MAIN OPERATION
    const opResult = await cleanUpMain();
    // ==================
    if (!opResult.operation.success) {
      logger.error('Cleanup failed', opResult.operation.error, opResult.operation);
    }
  } catch (error) {
    logger.error(error);
  }
  return null;
});
