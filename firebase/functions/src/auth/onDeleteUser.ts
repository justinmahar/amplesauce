import * as functionsV1 from 'firebase-functions/v1';
import { UserSettings } from '../firestore/models/UserSettings';

// Trigger docs: https://firebase.google.com/docs/functions/auth-events#trigger_a_function_on_user_deletion
export const onDeleteUser = functionsV1.auth.user().onDelete((user) => {
  // Delete the user settings
  UserSettings.deleteUserSettings(user.uid);
});
