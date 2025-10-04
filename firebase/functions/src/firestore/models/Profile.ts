import { DocumentData, DocumentSnapshot, Firestore } from 'firebase-admin/firestore';
import { UserRecord } from 'firebase-admin/auth';
import { DocDataAccessor } from './DocDataAccessor';

export const profileCollectionName = 'profiles';

export enum ProfileFields {
  username = 'uN',
}

export const ProfileDefaults = {
  [ProfileFields.username]: '',
};

/**
 * Public user-facing profile information.
 */
export class Profile extends DocDataAccessor {
  // Note: Constructor is inherited: super(uid, data, collectionPath)

  public getUsername = (): string => {
    return this.getValue(this.getData()[ProfileFields.username], ProfileDefaults[ProfileFields.username]);
  };

  public setUsername = (username: string): Promise<boolean> => {
    return this.update({ [ProfileFields.username]: username });
  };

  public getTotalViews = (): number => {
    return 0;
  };

  public setTotalViews = (_totalViews: number): Promise<boolean> => {
    return Promise.resolve(true);
  };

  public getFlexScore = (): number => {
    return 0;
  };

  public setFlexScore = (_flexScore: number): Promise<boolean> => {
    return Promise.resolve(true);
  };

  // === Static === === === === === === === === === === === === === === ===

  /**
   * Generates a unique username by checking for collisions in the database.
   * If a collision is found, a random number is appended.
   * @param baseUsername The initial username to check.
   * @param firestore The Firestore instance.
   * @returns A unique username.
   */
  private static _generateUniqueUsername = async (baseUsername: string, firestore: Firestore): Promise<string> => {
    let username = baseUsername;
    let isUnique = false;

    while (!isUnique) {
      const snapshot = await firestore
        .collection(profileCollectionName)
        .where(ProfileFields.username, '==', username)
        .limit(1)
        .get();

      if (snapshot.empty) {
        isUnique = true;
      } else {
        const randomNum = Math.floor(Math.random() * 10000000);
        username = `${baseUsername}${randomNum}`;
      }
    }
    return username;
  };

  public static populateDefaultProfile = async (
    user: UserRecord,
    firestore: Firestore,
  ): Promise<DocumentSnapshot<DocumentData>> => {
    const docRef = firestore.doc(`${profileCollectionName}/${user.uid}`);
    const profileSnap = await this.getDocSnapshotByRef(docRef);

    if (!profileSnap || !profileSnap.exists) {
      // Logic for generating a unique username on initial creation
      const defaultUsername = 'BeastTamer';
      const baseUsernameSource = user.email ? user.email.substring(0, user.email.indexOf('@')) : defaultUsername;
      let sanitizedBaseUsername = baseUsernameSource.replace(/[^a-zA-Z0-9_]/g, '');
      sanitizedBaseUsername = sanitizedBaseUsername || defaultUsername;
      const uniqueUsername = await this._generateUniqueUsername(sanitizedBaseUsername, firestore);

      const defaultProfileData: DocumentData = {
        [ProfileFields.username]: uniqueUsername,
      };

      await docRef.set(defaultProfileData);
      const docSnapshot = await docRef.get();
      return docSnapshot;
    }

    return profileSnap;
  };
}
