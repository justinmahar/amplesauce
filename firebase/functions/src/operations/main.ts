import { OperationResult } from '../types/OperationResult';
import { deleteGeneralRateLimiter } from './firestore-operations';

// === === === === === === === === === === === === === === === ===
// 🏁 Main Operations
// === === === === === === === === === === === === === === === ===

export const cleanUpMain = async (): Promise<OperationResult<undefined>> => {
  const mainOpResult = new OperationResult<undefined>('cleanUpMain');
  try {
    // ==================
    // ==> DELETE GENERAL RATE LIMITER OPERATION
    const deleteGeneralRateLimiterOpResult = await deleteGeneralRateLimiter();
    mainOpResult.addSubOp(deleteGeneralRateLimiterOpResult.operation);
    // ==================
    // trackEvent({ message: `Daily maintenance completed.`, type: 'cleanup' });
  } catch (error) {
    mainOpResult.operation.error = `${error}`;
  }

  mainOpResult.operation.success = !mainOpResult.operation.error;

  return mainOpResult;
};

/**
 * A test function for doing whatever you want, when you want.
 * @returns The result of the operation.
 */
export const utilityMain = async (): Promise<OperationResult<undefined>> => {
  const mainOpResult = new OperationResult<undefined>('utilityMain');
  try {
    // ==================
    // ==> PERFORM UTILITY OPERATIONS
    const stuffOpResult = await cleanUpMain();
    mainOpResult.addSubOp(stuffOpResult.operation);
    // ==================
  } catch (error) {
    mainOpResult.operation.error = `${error}`;
  }

  mainOpResult.operation.success = !mainOpResult.operation.error;

  return mainOpResult;
};
