import FirebaseFunctionsRateLimiter from 'firebase-functions-rate-limiter';
import { firestore } from '../../firebase/firebase-app';

// === === === === === === === === === === === === === === === ===
// 🚦 Rate Limiters
// === === === === === === === === === === === === === === === ===

// General rate limiter
export const generalRateLimiterConfig = {
  name: 'general-rate-limiter',
  maxCalls: 2,
  periodSeconds: 30,
};
export const generalRateLimiter = FirebaseFunctionsRateLimiter.withFirestoreBackend(
  generalRateLimiterConfig,
  firestore,
);
