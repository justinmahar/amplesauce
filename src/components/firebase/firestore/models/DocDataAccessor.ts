import {
  addDoc,
  collection,
  deleteField,
  doc,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  FieldValue,
  getDoc,
  updateDoc,
  setDoc,
  Timestamp,
  serverTimestamp,
  QuerySnapshot,
  QueryDocumentSnapshot,
  deleteDoc,
} from 'firebase/firestore';
import { firestore } from '../../firebase-app';

// Export commonly used types for convenience.
/** Alias for `DocumentData` */
export type DocData = DocumentData;
/** Alias for `DocumentSnapshot<DocData>` */
export type DocDataSnapshot = DocumentSnapshot<DocData>;
/** Alias for `DocumentReference<DocData>` */
export type DocDataReference = DocumentReference<DocData>;
/** Alias for `QuerySnapshot<DocData>` */
export type QueryDataSnapshot = QuerySnapshot<DocData>;
/** Alias for `QueryDocumentSnapshot<DocData>` */
export type QueryDocDataSnapshot = QueryDocumentSnapshot<DocData>;

/**
 * This class provides easy access to Firestore document data.
 */
export class DocDataAccessor {
  private uid: string;
  private data: DocumentData;
  private collectionPath: string;
  constructor(uid: string, data: DocumentData, collectionPath: string) {
    this.uid = uid;
    this.data = data;
    this.collectionPath = collectionPath;
  }

  public getUid(): string {
    return this.uid;
  }

  public getData(): DocumentData {
    return this.data;
  }

  public getValue<T>(value: T | undefined, defaultValue: T): T {
    if (typeof value === 'undefined') {
      return defaultValue;
    }
    return value;
  }

  public getDateValue(
    timestamp: Timestamp | { seconds: number; nanoseconds: number } | undefined,
    defaultValue: Date,
  ): Date {
    if (timestamp) {
      return new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate();
    }
    return defaultValue;
  }

  public update = (partial: DocumentData): Promise<boolean> => {
    return DocDataAccessor.updateDoc(partial, this.getUid(), this.collectionPath);
  };

  /** Gets the path to the collection containing this doc in the database. */
  public getCollectionPath(): string {
    return this.collectionPath;
  }

  /** Gets the path to the document in the database. */
  public getDocPath(): string {
    return DocDataAccessor.getCollectionDocPath(this.collectionPath, this.uid);
  }

  // === Static === === === === === === === === === === === === === === ===

  public static getCollectionDocPath(collectionPath: string, uid: string): string {
    return `${collectionPath.endsWith('/') ? collectionPath : collectionPath + '/'}${uid}`;
  }

  public static async getDocSnapshotById(
    uid: string,
    collectionPath: string,
  ): Promise<DocumentSnapshot<DocumentData> | undefined> {
    let snapshot = undefined;
    if (firestore) {
      try {
        const docRef = doc(firestore, `${collectionPath.endsWith('/') ? collectionPath : collectionPath + '/'}${uid}`);
        snapshot = await getDoc(docRef);
      } catch (error) {
        console.error(error);
      }
    }
    return snapshot;
  }

  public static async getDocSnapshotByRef(
    docRef?: DocumentReference<DocumentData>,
  ): Promise<DocumentSnapshot<DocumentData> | undefined> {
    let snapshot = undefined;
    if (docRef) {
      try {
        snapshot = await getDoc(docRef);
      } catch (error) {
        console.error(error);
      }
    }
    return snapshot;
  }

  public static async addDoc(
    data: DocumentData,
    collectionPath: string,
  ): Promise<DocumentReference<DocumentData> | undefined> {
    let docRef = undefined;
    if (firestore) {
      try {
        const collectionRef = collection(firestore, collectionPath);
        const keys = Object.keys(data);
        keys.forEach((key) => typeof data[key] === 'undefined' && delete data[key]);
        docRef = await addDoc(collectionRef, data);
      } catch (error) {
        console.error(error);
      }
    }
    return docRef;
  }

  public static async updateDoc(
    data: DocumentData,
    uid: string,
    collectionPath: string,
    showErrors = true,
  ): Promise<boolean> {
    let successful = false;
    if (firestore) {
      try {
        const collectionRef = collection(firestore, collectionPath);
        const document = doc(collectionRef, uid);
        const keys = Object.keys(data);
        keys.forEach((key) => {
          if (typeof data[key] === 'undefined') {
            data[key] = this.deleteField();
          }
        });
        await updateDoc(document, data);
        successful = true;
      } catch (error) {
        if (showErrors) {
          console.error(error);
        }
      }
    }
    return successful;
  }

  public static async setDoc(
    data: DocData,
    uid: string,
    collectionPath: string,
    merge = true,
    showErrors = true,
  ): Promise<boolean> {
    let successful = false;
    if (firestore) {
      try {
        const collectionRef = collection(firestore, collectionPath);
        const document = doc(collectionRef, uid);
        const keys = Object.keys(data);
        keys.forEach((key) => {
          if (typeof data[key] === 'undefined') {
            data[key] = this.deleteField();
          }
        });
        await setDoc(document, data, { merge });
        successful = true;
      } catch (error) {
        if (showErrors) {
          console.error(error);
        }
      }
    }
    return successful;
  }

  public static async updateOrSetDoc(
    data: DocData,
    uid: string,
    collectionPath: string,
    merge = true,
    showErrors = true,
  ): Promise<boolean> {
    let successful = await DocDataAccessor.updateDoc(data, uid, collectionPath, false);
    if (!successful) {
      successful = await DocDataAccessor.setDoc(data, uid, collectionPath, merge, showErrors);
    }
    return successful;
  }

  public static async deleteDoc(uid: string, collectionPath: string): Promise<void> {
    if (firestore) {
      return deleteDoc(doc(firestore, DocDataAccessor.getCollectionDocPath(collectionPath, uid)));
    }
    return Promise.resolve();
  }

  public static deleteField(): FieldValue {
    return deleteField();
  }

  public static serverTimestamp(): FieldValue {
    return serverTimestamp();
  }
}
