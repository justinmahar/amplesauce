import { doc, DocumentData, DocumentSnapshot } from 'firebase/firestore';
import React from 'react';
import * as FirestoreHooks from 'react-firebase-hooks/firestore';
import { UserSettings, userSettingsCollectionName } from '../firebase/firestore/models/UserSettings';
import { firestore } from '../firebase/firebase-app';
import { useUserAccountContext } from '../contexts/UserAccountProvider';

export interface UserSettingsLoader {
  userSettings?: UserSettings;
  loading: boolean;
  docSnapshot?: DocumentSnapshot<DocumentData>;
  error?: Error;
  pendingCreation: boolean;
}

/**
 * Hook to load the user's settings from Firestore.
 * @param userUid The uid of the user's account (from auth).
 */
export const useUserSettings = (userUid: string | undefined): UserSettingsLoader => {
  const userAccountContext = useUserAccountContext();
  const userSettingsRef = firestore ? doc(firestore, `${userSettingsCollectionName}/${userUid}`) : undefined;
  const [docSnapshot, loading, error] = FirestoreHooks.useDocument(userSettingsRef);
  const hasRefAndIsLoading = !!userSettingsRef && loading;

  const data: DocumentData | undefined = React.useMemo(
    () => (!hasRefAndIsLoading && docSnapshot ? docSnapshot.data() : undefined),
    [docSnapshot, hasRefAndIsLoading],
  );
  const userSettings = React.useMemo(
    () => (data && docSnapshot ? new UserSettings(docSnapshot.id, data, userSettingsCollectionName) : undefined),
    [data, docSnapshot],
  );
  const pendingCreation =
    !userAccountContext.loading && !!userAccountContext.user && !loading && !!docSnapshot && !docSnapshot?.exists();

  const userSettingsLoader: UserSettingsLoader = {
    userSettings,
    loading: hasRefAndIsLoading,
    docSnapshot,
    error,
    pendingCreation,
  };
  return userSettingsLoader;
};
