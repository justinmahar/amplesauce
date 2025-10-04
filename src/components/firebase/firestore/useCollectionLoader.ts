import { collection, CollectionReference, DocumentData, Query } from 'firebase/firestore';
import React from 'react';
import * as FirestoreHooks from 'react-firebase-hooks/firestore';
import { firestore } from '../firebase-app';
import { DocData, QueryDataSnapshot } from './models/DocDataAccessor';

export function useCollectionLoader<T>(
  collectionPath: string | undefined,
  query: (
    collRef?: CollectionReference<DocumentData>,
  ) => Query<DocumentData> | CollectionReference<DocumentData> | undefined = (collRef) => collRef,
  create: (id: string, data: DocData) => T,
  shouldLoad: boolean = true,
) {
  const ref = firestore && shouldLoad && collectionPath ? collection(firestore, collectionPath) : undefined;
  const collQuery = React.useMemo(() => query(ref), [query, ref]);
  const [snapshot, loading, error] = FirestoreHooks.useCollection(collQuery);
  const hasRefAndIsLoading = !!ref && shouldLoad && loading;
  const models: T[] =
    snapshot?.docs.map((doc) => {
      return create(doc.id, doc.data());
    }) ?? [];

  const loader: CollectionLoader<T> = {
    models,
    loading: hasRefAndIsLoading,
    snapshot: snapshot,
    error,
  };
  return loader;
}

export interface CollectionLoader<T> {
  models: T[];
  loading: boolean;
  snapshot?: QueryDataSnapshot;
  error?: Error;
}
