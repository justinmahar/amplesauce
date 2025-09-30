import { z } from 'genkit';
import { gemini } from '../config';
import { UserSettings } from '../../firestore/models/UserSettings';
import { firestore } from '../../firebase/firebase-app';

// Types/Interfaces
export interface AuthenticateUserInput {
  userUid: string;
  authToken: string;
}

export interface AuthenticateUserOutput {
  userSettings: UserSettings;
}

// Stubbed export: replace with defineFlow during implementation
export const authenticateUserFlow = gemini.defineFlow(
  {
    name: 'authenticateUserFlow',
    inputSchema: z.object({
      userUid: z.string(),
      authToken: z.string(),
    }),
    outputSchema: z.object({ userSettings: z.any() }),
  },
  async ({ userUid, authToken }): Promise<AuthenticateUserOutput> => {
    const doc = await firestore.doc(UserSettings.getUserSettingsDocPath(userUid)).get();
    if (!doc.exists) {
      throw new Error(`[authenticateUserFlow] Authentication failed. User settings not found for userUid: ${userUid}`);
    }
    const settings = new UserSettings(userUid, doc.data() ?? {}, UserSettings.getUserSettingsCollectionPath());
    if (settings.getAuthToken() !== authToken) {
      throw new Error('[authenticateUserFlow] Authentication failed: Invalid authToken.');
    }
    return { userSettings: settings };
  },
);
