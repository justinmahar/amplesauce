import { doc } from 'firebase/firestore';
import React from 'react';
import * as FirestoreHooks from 'react-firebase-hooks/firestore';
import { firestore } from '../firebase-app';
import { DocData, DocDataSnapshot } from './models/DocDataAccessor';

export function useDocLoader<T>(
  uid: string | undefined,
  docPath: string,
  create: (id: string, data: DocData) => T,
  shouldLoad: boolean = true,
) {
  const ref = uid && firestore && shouldLoad ? doc(firestore, docPath) : undefined;
  const [snapshot, loading, error] = FirestoreHooks.useDocument(uid ? ref : undefined);
  const hasRefAndIsLoading = !!ref && shouldLoad && loading;

  const data: DocData | undefined = React.useMemo(
    () => (!hasRefAndIsLoading && snapshot ? snapshot.data() : undefined),
    [snapshot, hasRefAndIsLoading],
  );
  const instance = React.useMemo(
    () => (data && snapshot ? create(snapshot.id, data) : undefined),
    [create, data, snapshot],
  );
  const loader: DocLoader<T> = {
    model: instance,
    loading: hasRefAndIsLoading,
    snapshot: snapshot,
    error,
  };
  return loader;
}

export interface DocLoader<T> {
  model?: T;
  loading: boolean;
  snapshot?: DocDataSnapshot;
  error?: Error;
}
