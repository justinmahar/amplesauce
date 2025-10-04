import { DocumentData } from 'firebase-admin/firestore';
import { DocDataAccessor } from './DocDataAccessor';

export const workspaceCollectionName = 'workspaces';

export enum WorkspaceFields {
  name = 'n',
  owners = 'o',
  channels = 'c',
  affiliateCollections = 'aC',
}

export interface WorkspaceChannelInfo {
  uid: string;
  name: string;
}

export interface AffiliateProgram {
  id: string;
  name: string;
  affiliateLink?: string;
  productUrl?: string;
  manageUrl?: string;
}

export interface AffiliateCollection {
  id: string;
  name: string;
  programs: AffiliateProgram[];
}

export interface WorkspaceData extends DocumentData {
  [WorkspaceFields.name]: string;
  [WorkspaceFields.owners]: string[];
  [WorkspaceFields.channels]: WorkspaceChannelInfo[];
  [WorkspaceFields.affiliateCollections]: AffiliateCollection[];
}

export const WorkspaceDefaults: WorkspaceData = {
  [WorkspaceFields.name]: '',
  [WorkspaceFields.owners]: [],
  [WorkspaceFields.channels]: [],
  [WorkspaceFields.affiliateCollections]: [],
};

export class Workspace extends DocDataAccessor {
  public static readonly MAX_WORKSPACES = 3;
  public getName = (): string => {
    return this.getValue(this.getData()[WorkspaceFields.name], WorkspaceDefaults[WorkspaceFields.name]);
  };

  public setName = (name: string): Promise<boolean> => {
    return this.update({ [WorkspaceFields.name]: name });
  };

  public getOwners = (): string[] => {
    return this.getValue(this.getData()[WorkspaceFields.owners], WorkspaceDefaults[WorkspaceFields.owners]);
  };

  public setOwners = (owners: string[]): Promise<boolean> => {
    return this.update({ [WorkspaceFields.owners]: owners });
  };

  public getChannels = (): WorkspaceChannelInfo[] => {
    return this.getValue(this.getData()[WorkspaceFields.channels], WorkspaceDefaults[WorkspaceFields.channels]);
  };

  public setChannels = (channels: WorkspaceChannelInfo[]): Promise<boolean> => {
    return this.update({ [WorkspaceFields.channels]: channels });
  };

  public getAffiliateCollections = (): AffiliateCollection[] => {
    return this.getValue(
      this.getData()[WorkspaceFields.affiliateCollections],
      WorkspaceDefaults[WorkspaceFields.affiliateCollections],
    );
  };

  public setAffiliateCollections = (affiliateCollections: AffiliateCollection[]): Promise<boolean> => {
    return this.update({ [WorkspaceFields.affiliateCollections]: affiliateCollections });
  };

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

  // === Static ===
  public static getWorkspaceCollectionPath(): string {
    return workspaceCollectionName;
  }

  public static getWorkspaceDocPath(uid: string): string {
    return `${workspaceCollectionName}/${uid}`;
  }
}
