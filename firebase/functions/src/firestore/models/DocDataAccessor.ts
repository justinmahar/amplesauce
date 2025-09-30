import { DocumentData, DocumentReference, DocumentSnapshot, FieldValue } from 'firebase-admin/firestore';
import { firestore } from '../../firebase/firebase-app';

/**
 * This class pairs a Firebase uid with the data for its document.
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

  public update = (partial: DocumentData): Promise<boolean> => {
    return DocDataAccessor.updateDoc(partial, this.getUid(), this.collectionPath);
  };

  // === Static === === === === === === === === === === === === === === ===
  public static getCollectionDocPath(collectionPath: string, uid: string): string {
    return `${collectionPath.endsWith('/') ? collectionPath : collectionPath + '/'}${uid}`;
  }

  public static async getDocSnapshotById(
    uid: string,
    collectionPath: string,
  ): Promise<DocumentSnapshot<DocumentData> | undefined> {
    let snapshot = undefined;
    try {
      const docRef = firestore.doc(`${collectionPath.endsWith('/') ? collectionPath : collectionPath + '/'}${uid}`);
      snapshot = await docRef.get();
    } catch (error) {
      console.error(error);
    }
    return snapshot;
  }

  public static async getDocSnapshotByRef(
    docRef?: DocumentReference<DocumentData>,
  ): Promise<DocumentSnapshot<DocumentData> | undefined> {
    let snapshot = undefined;
    if (docRef) {
      try {
        snapshot = await docRef.get();
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
    try {
      const collectionRef = firestore.collection(collectionPath);
      const keys = Object.keys(data);
      keys.forEach((key) => typeof data[key] === 'undefined' && delete data[key]);
      docRef = await collectionRef.add(data);
    } catch (error) {
      console.error(error);
    }
    return docRef;
  }

  public static async updateDoc(data: DocumentData, uid: string, collectionPath: string): Promise<boolean> {
    let successful = false;
    try {
      const collectionRef = firestore.collection(collectionPath);
      const document = collectionRef.doc(uid);
      const keys = Object.keys(data);
      keys.forEach((key) => {
        if (typeof data[key] === 'undefined') {
          data[key] = this.deleteField();
        }
      });
      await document.update(data);
      successful = true;
    } catch (error) {
      console.error(error);
    }
    return successful;
  }

  public static async setDoc(data: DocumentData, uid: string, collectionPath: string): Promise<boolean> {
    let successful = false;
    try {
      const collectionRef = firestore.collection(collectionPath);
      const document = collectionRef.doc(uid);
      const keys = Object.keys(data);
      keys.forEach((key) => {
        if (typeof data[key] === 'undefined') {
          data[key] = this.deleteField();
        }
      });
      await document.set(data);
      successful = true;
    } catch (error) {
      console.error(error);
    }
    return successful;
  }

  public static async deleteDoc(uid: string, collectionPath: string): Promise<FirebaseFirestore.WriteResult> {
    return firestore.doc(DocDataAccessor.getCollectionDocPath(collectionPath, uid)).delete();
  }

  public static deleteField(): FieldValue {
    return FieldValue.delete();
  }
}
