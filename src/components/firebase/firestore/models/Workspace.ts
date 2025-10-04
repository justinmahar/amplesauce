import { CollectionReference, DocumentData, limit, query } from 'firebase/firestore';
import React from 'react';
import { DocData, DocDataAccessor, DocDataReference } from './DocDataAccessor';
import { CollectionLoader, useCollectionLoader } from '../useCollectionLoader';
import { DocLoader, useDocLoader } from '../useDocLoader';

export enum WorkspaceFields {
  name = 'n',
  owners = 'o',
  channels = 'c',
  affiliateCollections = 'aC',
}

export interface WorkspaceChannel {
  uid: string;
  name: string;
}

export interface AffiliateProgram {
  id: string; // separate identifier from doc uid
  name: string;
  affiliateLink?: string;
  productUrl?: string;
  manageUrl?: string;
}

export interface AffiliateCollection {
  id: string; // separate identifier from doc uid
  name: string;
  programs: AffiliateProgram[];
}

export interface WorkspaceData {
  [WorkspaceFields.name]: string;
  [WorkspaceFields.owners]: string[];
  [WorkspaceFields.channels]: WorkspaceChannel[];
  [WorkspaceFields.affiliateCollections]: AffiliateCollection[];
}

export class Workspace extends DocDataAccessor {
  public static readonly MAX_WORKSPACES = 3;
  public static defaults: WorkspaceData = {
    [WorkspaceFields.name]: '',
    [WorkspaceFields.owners]: [],
    [WorkspaceFields.channels]: [],
    [WorkspaceFields.affiliateCollections]: [],
  };

  public static collectionName = 'workspaces';

  constructor(uid: string, data: DocData) {
    super(uid, data, Workspace.getWorkspaceCollectionPath());
  }

  // Getters/Setters
  public getName(): string {
    return this.getValue(this.getData()[WorkspaceFields.name], Workspace.defaults[WorkspaceFields.name]);
  }

  public setName(name: string): Promise<boolean> {
    return this.update({ [WorkspaceFields.name]: name });
  }

  public getOwners(): string[] {
    return this.getValue(this.getData()[WorkspaceFields.owners], Workspace.defaults[WorkspaceFields.owners]);
  }

  public setOwners(owners: string[]): Promise<boolean> {
    return this.update({ [WorkspaceFields.owners]: owners });
  }

  public getChannels(): WorkspaceChannel[] {
    return this.getValue(this.getData()[WorkspaceFields.channels], Workspace.defaults[WorkspaceFields.channels]);
  }

  public setChannels(channels: WorkspaceChannel[]): Promise<boolean> {
    return this.update({ [WorkspaceFields.channels]: channels });
  }

  public getAffiliateCollections(): AffiliateCollection[] {
    return this.getValue(
      this.getData()[WorkspaceFields.affiliateCollections],
      Workspace.defaults[WorkspaceFields.affiliateCollections],
    );
  }

  public setAffiliateCollections(affiliateCollections: AffiliateCollection[]): Promise<boolean> {
    return this.update({ [WorkspaceFields.affiliateCollections]: affiliateCollections });
  }

  // ---- Helpers: Affiliate Collections ----
  public addAffiliateCollection = (collection: AffiliateCollection): Promise<boolean> => {
    if (!collection || !collection.id || !collection.name) {
      return Promise.resolve(false);
    }
    const current = [...this.getAffiliateCollections()];
    const exists = current.some((c) => c.id === collection.id);
    if (exists) {
      return Promise.resolve(true);
    }
    current.push({ ...collection, programs: collection.programs ?? [] });
    return this.setAffiliateCollections(current);
  };

  public removeAffiliateCollection = (collectionId: string): Promise<boolean> => {
    if (!collectionId) {
      return Promise.resolve(false);
    }
    const current = this.getAffiliateCollections();
    const next = current.filter((c) => c.id !== collectionId);
    if (next.length === current.length) {
      return Promise.resolve(true);
    }
    return this.setAffiliateCollections(next);
  };

  // ---- Helpers: Programs within a Collection ----
  public setAffiliateProgramInCollection = (collectionId: string, program: AffiliateProgram): Promise<boolean> => {
    if (!collectionId || !program || !program.id || !program.name) {
      return Promise.resolve(false);
    }
    const current = [...this.getAffiliateCollections()];
    const idx = current.findIndex((c) => c.id === collectionId);
    if (idx < 0) {
      return Promise.resolve(false);
    }
    const col = { ...current[idx] };
    const programs = Array.isArray(col.programs) ? [...col.programs] : [];
    const existingIdx = programs.findIndex((p) => p.id === program.id);
    if (existingIdx >= 0) {
      programs[existingIdx] = { ...program };
    } else {
      programs.push({ ...program });
    }
    col.programs = programs;
    current[idx] = col;
    return this.setAffiliateCollections(current);
  };

  public removeAffiliateProgramFromCollection = (collectionId: string, programId: string): Promise<boolean> => {
    if (!collectionId || !programId) {
      return Promise.resolve(false);
    }
    const current = [...this.getAffiliateCollections()];
    const idx = current.findIndex((c) => c.id === collectionId);
    if (idx < 0) {
      return Promise.resolve(true);
    }
    const col = { ...current[idx] };
    const programs = (col.programs ?? []).filter((p) => p.id !== programId);
    col.programs = programs;
    current[idx] = col;
    return this.setAffiliateCollections(current);
  };

  // ---- STATIC -------------------------------------------------------------
  public static getWorkspaceCollectionPath(): string {
    return Workspace.collectionName;
  }

  public static getWorkspaceDocPath(uid?: string): string {
    return DocDataAccessor.getCollectionDocPath(Workspace.getWorkspaceCollectionPath(), `${uid}`);
  }

  public static addWorkspace = (data: DocData): Promise<DocDataReference | undefined> => {
    return DocDataAccessor.addDoc(data, Workspace.getWorkspaceCollectionPath());
  };

  public static setWorkspace = (uid: string, data: DocData): Promise<boolean> => {
    return DocDataAccessor.setDoc(data, uid, Workspace.getWorkspaceCollectionPath());
  };
}

const createWorkspace = (uid: string, data: DocData) => new Workspace(uid, data);

/** Loads a single Workspace. */
export const useWorkspace = (uid?: string): DocLoader<Workspace> => {
  return useDocLoader<Workspace>(uid, Workspace.getWorkspaceDocPath(uid), React.useCallback(createWorkspace, []));
};

/** Loads a collection of Workspaces. */
export const useWorkspaces = (): CollectionLoader<Workspace> => {
  const myQuery = (collRef?: CollectionReference<DocumentData>) => (collRef ? query(collRef, limit(10)) : collRef);
  return useCollectionLoader(
    Workspace.getWorkspaceCollectionPath(),
    React.useCallback(myQuery, []),
    React.useCallback(createWorkspace, []),
  );
};
