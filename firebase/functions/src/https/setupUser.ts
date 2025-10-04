import { getAuth } from 'firebase-admin/auth';
import { https } from 'firebase-functions/v1';
import { StatusCodes } from 'http-status-codes';
import { firestore } from '../firebase/firebase-app';
import { UserSettings } from '../firestore/models/UserSettings';
import { createWorkspaceForUser } from './createWorkspace';
import { generalRateLimiter } from '../firestore/rate-limiters/rate-limiters';
import { HttpsRequestResult } from '../types/HttpsRequestResult';
import { handleCors } from './handleCors';

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// --- HTTPS Functions --- --- --- --- --- --- --- --- --- --- ---
// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

/**
 * Sets up a new user account.
 */
export const setupUser = https.onRequest(async (request, response): Promise<void> => {
  handleCors(request, response, async () => {
    const httpResult = new HttpsRequestResult();
    try {
      await generalRateLimiter.rejectOnQuotaExceededOrRecordUsage(request.ip);
      try {
        if (request.method === 'POST') {
          // Extract args
          const userIdArgName = 'userId';
          const userId: string = (request.body[userIdArgName] ?? '').trim();

          // Check for missing args
          const missingArgs: string[] = [];
          if (!userId) {
            missingArgs.push(userIdArgName);
          }
          // If any args are missing, error out
          if (missingArgs.length > 0) {
            httpResult.status = StatusCodes.BAD_REQUEST;
            httpResult.error = `Missing argument${missingArgs.length !== 1 ? 's' : ''}: ${missingArgs.join(', ')}`;
          } else {
            const userRecord = await getAuth().getUser(userId);
            const userSettingsSnap = await UserSettings.populateDefaultUserSettings(userRecord, firestore);
            const userSettings = new UserSettings(
              userId,
              userSettingsSnap.data() ?? {},
              UserSettings.getUserSettingsCollectionPath(),
            );
            if (!userSettings.getWorkspaces().length) {
              // If no workspaces, create one
              await createWorkspaceForUser(userId);
            }
            httpResult.status = StatusCodes.OK;
            httpResult.value = `Setup completed!`;
          }
        } else {
          httpResult.status = StatusCodes.METHOD_NOT_ALLOWED;
          httpResult.error = `Method ${request.method} not allowed. Only POST is allowed.`;
        }
      } catch (_error) {
        httpResult.status = StatusCodes.INTERNAL_SERVER_ERROR;
        httpResult.error = `Unexpected error setting up user`;
        httpResult.success = false;
      }
    } catch (_error) {
      httpResult.status = StatusCodes.TOO_MANY_REQUESTS;
      httpResult.error = `Error: Too many requests. Please wait and try again.`;
      httpResult.success = false;
    }

    httpResult.send(response);
  });
});
