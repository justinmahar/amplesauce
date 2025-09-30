import { CollectionReference, DocumentData, limit, query } from 'firebase/firestore';
import React from 'react';
import { DocData, DocDataAccessor, DocDataReference } from './DocDataAccessor';
import { CollectionLoader, useCollectionLoader } from '../useCollectionLoader';
import { DocLoader, useDocLoader } from '../useDocLoader';

export enum ExampleFields {
  name = 'name',
}

export interface ExampleData {
  [ExampleFields.name]: string;
}

export class Example extends DocDataAccessor {
  /** Field defaults for the database document. These will be returned if the value is undefined. */
  public static defaults: ExampleData = {
    [ExampleFields.name]: '',
  };

  public static collectionName = 'examples';

  constructor(uid: string, data: DocData) {
    super(uid, data, Example.getExampleCollectionPath());
  }

  public getName(): string {
    return this.getValue(this.getData()[ExampleFields.name], Example.defaults.name);
  }

  public setName(name: string): Promise<boolean> {
    return this.update({ [ExampleFields.name]: name });
  }

  // ---- STATIC -------------------------------------------------------------

  public static getExampleCollectionPath(): string {
    return Example.collectionName;
    // Note: If nested, pass the parent uid(s) as args and do this:
    // const parentDocPath = Parent.getParentDocPath(parentUid);
    // // OR: const parentDocPath = DocDataAccessor.getCollectionDocPath(Parent.ORG_COLLECTION_NAME, parentUid);
    // return `${parentDocPath}/${Example.TEMPLATE_MODEL_COLLECTION_NAME}`;
  }

  public static getExampleDocPath(uid?: string): string {
    return DocDataAccessor.getCollectionDocPath(Example.getExampleCollectionPath(), `${uid}`);
  }

  public static addExample = (data: DocData): Promise<DocDataReference | undefined> => {
    return DocDataAccessor.addDoc(data, Example.getExampleCollectionPath());
  };

  public static setExample = (uid: string, data: DocData): Promise<boolean> => {
    return DocDataAccessor.setDoc(data, uid, Example.getExampleCollectionPath());
  };
}

const createExample = (uid: string, data: DocData) => new Example(uid, data);

/** Loads a single Example. */
export const useExample = (uid?: string): DocLoader<Example> => {
  return useDocLoader<Example>(uid, Example.getExampleDocPath(uid), React.useCallback(createExample, []));
};

/** Loads a collection of Examples. */
export const useExamples = (): CollectionLoader<Example> => {
  // !!! Customize this collection loader by adding to the query, or remove the query completely.
  // See: https://firebase.google.com/docs/firestore/query-data/order-limit-data
  const myQuery = (collRef?: CollectionReference<DocumentData>) => (collRef ? query(collRef, limit(10)) : collRef);
  return useCollectionLoader(
    Example.getExampleCollectionPath(),
    React.useCallback(myQuery, []),
    React.useCallback(createExample, []),
  );
};
