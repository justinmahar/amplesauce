import firebase_tools from 'firebase-tools';
import { firestore } from '../firebase/firebase-app';
import { OperationResult } from '../types/OperationResult';
import { generalRateLimiterConfig } from '../firestore/rate-limiters/rate-limiters';

// === === === === === === === === === === === === === === === === === === === === ===
// 🗃️ Firestore Operations
// === === === === === === === === === === === === === === === === === === === === ===

export const deleteGeneralRateLimiter = async (): Promise<OperationResult<undefined>> => {
  const opResult = new OperationResult<undefined>('deleteRateLimiters');
  try {
    // Delete general rate limiter
    const generalRateLimiterCollectionRef = firestore.collection(`/${generalRateLimiterConfig.name}`);
    await firebase_tools.firestore.delete(generalRateLimiterCollectionRef.path, {
      project: process.env.GCLOUD_PROJECT,
      recursive: true,
      yes: true,
    });

    opResult.operation.success = true;
  } catch (error) {
    opResult.operation.success = false;
    opResult.operation.error = `${error}`;
  }

  opResult.operation.success = !opResult.operation.error;

  return opResult;
};

/**
 * Template for an operation.
 */
export const runOperationTemplate = async (): Promise<OperationResult<undefined>> => {
  const opResult = new OperationResult<undefined>('runOperationTemplate');
  try {
    // Do stuff here
    opResult.operation.success = true;
  } catch (error) {
    opResult.operation.success = false;
    opResult.operation.error = `${error}`;
  }

  opResult.operation.success = !opResult.operation.error;

  return opResult;
};
