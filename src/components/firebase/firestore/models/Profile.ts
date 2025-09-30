import { CollectionReference, DocumentData, limit, query } from 'firebase/firestore';
import React from 'react';
import { DocData, DocDataAccessor, DocDataReference } from './DocDataAccessor';
import { CollectionLoader, useCollectionLoader } from '../useCollectionLoader';
import { DocLoader, useDocLoader } from '../useDocLoader';

export enum ProfileFields {
  username = 'uN',
  totalViews = 'tV',
  flexScore = 'fS',
}

export interface ProfileData {
  [ProfileFields.username]: string;
  [ProfileFields.totalViews]: number;
  [ProfileFields.flexScore]: number;
}

export class Profile extends DocDataAccessor {
  /** Field defaults for the database document. These will be returned if the value is undefined. */
  public static defaults: ProfileData = {
    [ProfileFields.username]: '',
    [ProfileFields.totalViews]: 0,
    [ProfileFields.flexScore]: 0,
  };

  public static collectionName = 'profiles';

  constructor(uid: string, data: DocData) {
    super(uid, data, Profile.getProfileCollectionPath());
  }

  public getUsername(): string {
    return this.getValue(this.getData()[ProfileFields.username], Profile.defaults.uN);
  }

  public setUsername(username: string): Promise<boolean> {
    return this.update({ [ProfileFields.username]: username });
  }

  public getTotalViews(): number {
    return this.getValue(this.getData()[ProfileFields.totalViews], Profile.defaults.tV);
  }

  public setTotalViews(totalViews: number): Promise<boolean> {
    return this.update({ [ProfileFields.totalViews]: totalViews });
  }

  public getFlexScore(): number {
    return this.getValue(this.getData()[ProfileFields.flexScore], Profile.defaults.fS);
  }

  public setFlexScore(flexScore: number): Promise<boolean> {
    return this.update({ [ProfileFields.flexScore]: flexScore });
  }

  // ---- STATIC -------------------------------------------------------------

  public static getProfileCollectionPath(): string {
    return Profile.collectionName;
  }

  public static getProfileDocPath(uid?: string): string {
    return DocDataAccessor.getCollectionDocPath(Profile.getProfileCollectionPath(), `${uid}`);
  }

  public static addProfile = (data: DocData): Promise<DocDataReference | undefined> => {
    return DocDataAccessor.addDoc(data, Profile.getProfileCollectionPath());
  };

  public static setProfile = (uid: string, data: DocData): Promise<boolean> => {
    return DocDataAccessor.setDoc(data, uid, Profile.getProfileCollectionPath());
  };
}

const createProfile = (uid: string, data: DocData) => new Profile(uid, data);

/** Loads a single Profile. */
export const useProfile = (uid?: string): DocLoader<Profile> => {
  return useDocLoader<Profile>(uid, Profile.getProfileDocPath(uid), React.useCallback(createProfile, []));
};

/** Loads a collection of Profiles. */
export const useProfiles = (): CollectionLoader<Profile> => {
  // !!! Customize this collection loader by adding to the query, or remove the query completely.
  // See: https://firebase.google.com/docs/firestore/query-data/order-limit-data
  const myQuery = (collRef?: CollectionReference<DocumentData>) => (collRef ? query(collRef, limit(10)) : collRef);
  return useCollectionLoader(
    Profile.getProfileCollectionPath(),
    React.useCallback(myQuery, []),
    React.useCallback(createProfile, []),
  );
};
