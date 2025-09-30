import { DocDataAccessor } from './DocDataAccessor';

export const userSettingsCollectionName = 'users';

export enum UserSettingsFields {
  displayName = 'dN',
  email = 'e',
  roleAdmin = 'rA',
  creationTime = 'cT',
  channels = 'ch',
  photoURL = 'pU',
  authToken = 'aT',
}

export interface UserSettingsData {
  [UserSettingsFields.displayName]: string;
  [UserSettingsFields.email]: string;
  [UserSettingsFields.roleAdmin]: boolean;
  [UserSettingsFields.creationTime]: number;
  [UserSettingsFields.channels]: Record<string, Channel>;
  [UserSettingsFields.photoURL]: string;
  [UserSettingsFields.authToken]: string;
}

export const UserSettingsDefaults: Partial<UserSettingsData> = {
  [UserSettingsFields.displayName]: '',
  [UserSettingsFields.email]: '',
  [UserSettingsFields.roleAdmin]: false,
  [UserSettingsFields.creationTime]: 0,
  [UserSettingsFields.channels]: {},
  [UserSettingsFields.photoURL]: '',
  [UserSettingsFields.authToken]: '',
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
      UserSettingsDefaults[UserSettingsFields.roleAdmin] ?? false,
    );
  };

  public getCreationTime = (): number => {
    return this.getValue(
      this.getData()[UserSettingsFields.creationTime],
      UserSettingsDefaults[UserSettingsFields.creationTime] ?? 0,
    );
  };

  public setCreationTime = (creationTime: number): Promise<boolean> => {
    return this.update({ [UserSettingsFields.creationTime]: creationTime });
  };

  public getChannels = (): Record<string, Channel> => {
    return this.getValue(
      this.getData()[UserSettingsFields.channels],
      UserSettingsDefaults[UserSettingsFields.channels] ?? {},
    );
  };

  public getPhotoURL = (): string => {
    return this.getValue(
      this.getData()[UserSettingsFields.photoURL],
      UserSettingsDefaults[UserSettingsFields.photoURL] ?? '',
    );
  };

  public getAuthToken = (): string => {
    return this.getValue(
      this.getData()[UserSettingsFields.authToken],
      UserSettingsDefaults[UserSettingsFields.authToken] ?? '',
    );
  };

  public setAuthToken = (authToken: string): Promise<boolean> => {
    return this.update({ [UserSettingsFields.authToken]: authToken });
  };

  // === Static === === === === === === === === === === === === === === ===
}
