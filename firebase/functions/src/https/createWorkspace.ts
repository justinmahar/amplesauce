import { getAuth } from 'firebase-admin/auth';
import { https } from 'firebase-functions/v1';
import { StatusCodes } from 'http-status-codes';
import { firestore } from '../firebase/firebase-app';
import { UserSettings, UserSettingsFields } from '../firestore/models/UserSettings';
import { Workspace, WorkspaceDefaults, WorkspaceFields } from '../firestore/models/Workspace';
import { generalRateLimiter } from '../firestore/rate-limiters/rate-limiters';
import { HttpsRequestResult } from '../types/HttpsRequestResult';
import { handleCors } from './handleCors';

export type CreateWorkspaceResult = { workspaceUid: string; name: string };

export const createWorkspaceForUser = async (userId: string): Promise<CreateWorkspaceResult> => {
  const userRecord = await getAuth().getUser(userId);
  const userSettingsSnap = await firestore.doc(UserSettings.getUserSettingsDocPath(userId)).get();
  if (!userSettingsSnap.exists) {
    throw new Error('User settings do not exist. Call setupUser first.');
  }
  const userSettings = new UserSettings(
    userId,
    userSettingsSnap.data() ?? {},
    UserSettings.getUserSettingsCollectionPath(),
  );
  const workspaces = userSettings.getWorkspaces();
  if (Array.isArray(workspaces) && workspaces.length >= Workspace.MAX_WORKSPACES) {
    throw new Error(`Workspace limit reached (max ${Workspace.MAX_WORKSPACES}).`);
  }

  const displayName = userSettings.getDisplayName() || userRecord.displayName || 'User';
  const workspaceName = `${displayName}'s Workspace`;
  const newWorkspaceData = {
    ...WorkspaceDefaults,
    [WorkspaceFields.name]: workspaceName,
    [WorkspaceFields.owners]: [userId],
  };
  const workspaceRef = await firestore.collection(Workspace.getWorkspaceCollectionPath()).add(newWorkspaceData);
  const newWorkspaceUid = workspaceRef.id;

  const updatedWorkspaces = [...(workspaces ?? []), newWorkspaceUid];
  const currentWs = userSettings.getCurrentWorkspaceUid();
  const updates: Record<string, unknown> = {
    [UserSettingsFields.workspaces]: updatedWorkspaces,
  };
  if (!currentWs) {
    updates[UserSettingsFields.currentWorkspaceUid] = newWorkspaceUid;
  }
  await firestore.doc(UserSettings.getUserSettingsDocPath(userId)).update(updates);

  return { workspaceUid: newWorkspaceUid, name: workspaceName };
};

export const createWorkspace = https.onRequest(async (request, response): Promise<void> => {
  handleCors(request, response, async () => {
    const httpResult = new HttpsRequestResult();
    try {
      await generalRateLimiter.rejectOnQuotaExceededOrRecordUsage(request.ip);
      try {
        if (request.method === 'POST') {
          const userIdArgName = 'userId';
          const userId: string = (request.body[userIdArgName] ?? '').trim();

          const missingArgs: string[] = [];
          if (!userId) {
            missingArgs.push(userIdArgName);
          }
          if (missingArgs.length > 0) {
            httpResult.status = StatusCodes.BAD_REQUEST;
            httpResult.error = `Missing argument${missingArgs.length !== 1 ? 's' : ''}: ${missingArgs.join(', ')}`;
          } else {
            const result = await createWorkspaceForUser(userId);
            httpResult.status = StatusCodes.OK;
            httpResult.value = `Workspace created: ${JSON.stringify(result)}`;
          }
        } else {
          httpResult.status = StatusCodes.METHOD_NOT_ALLOWED;
          httpResult.error = `Method ${request.method} not allowed. Only POST is allowed.`;
        }
      } catch (error) {
        httpResult.status = StatusCodes.INTERNAL_SERVER_ERROR;
        httpResult.error = `Unexpected error creating workspace: ${error}`;
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
