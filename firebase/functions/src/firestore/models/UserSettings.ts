import { UserRecord } from 'firebase-admin/auth';
import { DocumentData, DocumentSnapshot, Firestore } from 'firebase-admin/firestore';
import { v4 as uuidv4 } from 'uuid';
import { DocDataAccessor } from './DocDataAccessor';
import { createWorkspaceForUser } from '../../https/createWorkspace';

export const userSettingsCollectionName = 'users';

export enum UserSettingsFields {
  displayName = 'dN',
  email = 'e',
  roleAdmin = 'rA',
  creationTime = 'cT',
  photoURL = 'pU',
  channels = 'ch',
  authToken = 'aT',
  workspaces = 'w',
  currentWorkspaceUid = 'cW',
}

export const UserSettingsDefaults = {
  [UserSettingsFields.displayName]: '',
  [UserSettingsFields.email]: '',
  [UserSettingsFields.roleAdmin]: false,
  [UserSettingsFields.channels]: {},
  [UserSettingsFields.photoURL]: '',
  [UserSettingsFields.creationTime]: 0,
  [UserSettingsFields.authToken]: '',
  [UserSettingsFields.workspaces]: [],
  [UserSettingsFields.currentWorkspaceUid]: null as string | null,
};

export interface Channel {
  title: string;
  description: string;
  thumbnailUrl: string;
  customUrl: string;
}

/**
 * User settings are pulled from data in the users collection in Firestore. This
 * class abstracts away that implementation detail.
 *
 * Getters have default fallbacks in case the data is missing.
 */
export class UserSettings extends DocDataAccessor {
  // Note: Constructor is inherited: super(uid, data, collectionPath)

  public getDisplayName = (): string => {
    return this.getValue(
      this.getData()[UserSettingsFields.displayName],
      UserSettingsDefaults[UserSettingsFields.displayName],
    );
  };

  public setDisplayName = (displayName: string): Promise<boolean> => {
    return this.update({ [UserSettingsFields.displayName]: displayName });
  };

  public getEmail = (): string => {
    return this.getValue(this.getData()[UserSettingsFields.email], UserSettingsDefaults[UserSettingsFields.email]);
  };

  public isAdmin = (): boolean => {
    return this.getValue(
      this.getData()[UserSettingsFields.roleAdmin],
      UserSettingsDefaults[UserSettingsFields.roleAdmin],
    );
  };

  public getChannels = (): Record<string, Channel> => {
    return this.getValue(
      this.getData()[UserSettingsFields.channels],
      UserSettingsDefaults[UserSettingsFields.channels],
    );
  };

  public getCreationTime = (): number => {
    return this.getValue(
      this.getData()[UserSettingsFields.creationTime],
      UserSettingsDefaults[UserSettingsFields.creationTime],
    );
  };

  public getPhotoURL = (): string => {
    return this.getValue(
      this.getData()[UserSettingsFields.photoURL],
      UserSettingsDefaults[UserSettingsFields.photoURL],
    );
  };

  public getAuthToken = (): string => {
    return this.getValue(
      this.getData()[UserSettingsFields.authToken],
      UserSettingsDefaults[UserSettingsFields.authToken],
    );
  };

  public setAuthToken = (authToken: string): Promise<boolean> => {
    return this.update({ [UserSettingsFields.authToken]: authToken });
  };

  public getWorkspaces = (): string[] => {
    return this.getValue(
      this.getData()[UserSettingsFields.workspaces],
      UserSettingsDefaults[UserSettingsFields.workspaces],
    );
  };

  public setWorkspaces = (workspaces: string[]): Promise<boolean> => {
    return this.update({ [UserSettingsFields.workspaces]: workspaces });
  };

  public getCurrentWorkspaceUid = (): string | null => {
    return this.getValue(
      this.getData()[UserSettingsFields.currentWorkspaceUid],
      UserSettingsDefaults[UserSettingsFields.currentWorkspaceUid],
    );
  };

  public setCurrentWorkspaceUid = (currentWorkspaceUid: string | null): Promise<boolean> => {
    return this.update({ [UserSettingsFields.currentWorkspaceUid]: currentWorkspaceUid });
  };

  // === Static === === === === === === === === === === === === === === ===

  public static getUserSettingsCollectionPath(): string {
    return userSettingsCollectionName;
  }

  public static getUserSettingsDocPath(uid: string): string {
    return DocDataAccessor.getCollectionDocPath(UserSettings.getUserSettingsCollectionPath(), uid);
  }

  public static populateDefaultUserSettings = async (
    user: UserRecord,
    firestore: Firestore,
  ): Promise<DocumentSnapshot<DocumentData>> => {
    const docRef = firestore.doc(`${userSettingsCollectionName}/${user.uid}`);
    const userSettingsSnap = await this.getDocSnapshotByRef(docRef);

    const email = user.email || 'error@error.com';
    const displayName =
      typeof user.displayName === 'string' ? user.displayName.trim() : email.substring(0, email.indexOf('@'));
    const defaultUserSettingsData: DocumentData = {
      [UserSettingsFields.displayName]: displayName,
      [UserSettingsFields.email]: email,
      [UserSettingsFields.creationTime]: new Date(user.metadata.creationTime).getTime(),
      [UserSettingsFields.photoURL]: user.photoURL || '',
      [UserSettingsFields.workspaces]: [],
      [UserSettingsFields.currentWorkspaceUid]: null,
    };

    if (!userSettingsSnap || !userSettingsSnap.exists) {
      await docRef.set({
        ...defaultUserSettingsData,
        [UserSettingsFields.authToken]: uuidv4(),
      });
      const docSnapshot = await docRef.get();
      return docSnapshot;
    }

    return userSettingsSnap;
  };

  public static deleteUserSettings = (uid: string): Promise<FirebaseFirestore.WriteResult> => {
    return DocDataAccessor.deleteDoc(uid, UserSettings.getUserSettingsCollectionPath());
  };
}
