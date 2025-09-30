import React from 'react';
import { DocLoader, useDocLoader } from '../useDocLoader';
import { DocData, DocDataAccessor } from './DocDataAccessor';

export enum GeminiSettingsFields {
  apikey = 'apikey',
  model = 'model',
}

export interface GeminiSettingsData {
  [GeminiSettingsFields.apikey]: string;
  [GeminiSettingsFields.model]: string;
}

export class GeminiSettings extends DocDataAccessor {
  /** Field defaults for the database document. These will be returned if the value is undefined. */
  public static DEFAULTS: GeminiSettingsData = {
    [GeminiSettingsFields.apikey]: '',
    [GeminiSettingsFields.model]: '',
  };

  public static collectionName = 'genai';
  public static docName = 'gemini';

  constructor(uid: string, data: DocData) {
    super(uid, data, GeminiSettings.getCollectionPath());
  }

  public getApikey(): string {
    return this.getValue(this.getData()[GeminiSettingsFields.apikey], GeminiSettings.DEFAULTS.apikey);
  }

  public setApikey(apikey: string): Promise<boolean> {
    return this.update({ [GeminiSettingsFields.apikey]: apikey });
  }

  public getModel(): string {
    return this.getValue(this.getData()[GeminiSettingsFields.model], GeminiSettings.DEFAULTS.model);
  }

  public setModel(model: string): Promise<boolean> {
    return this.update({ [GeminiSettingsFields.model]: model });
  }

  // ---- STATIC -------------------------------------------------------------

  public static getCollectionPath(): string {
    return GeminiSettings.collectionName;
  }

  public static getDocPath(): string {
    return DocDataAccessor.getCollectionDocPath(GeminiSettings.getCollectionPath(), GeminiSettings.docName);
  }

  public static set = (data: Partial<GeminiSettingsData>): Promise<boolean> => {
    return DocDataAccessor.setDoc(data, GeminiSettings.docName, GeminiSettings.getCollectionPath());
  };
}

const createGeminiSettings = (uid: string, data: DocData) => new GeminiSettings(uid, data);

/** Loads the Gemini settings document. */
export const useGeminiSettings = (): DocLoader<GeminiSettings> => {
  return useDocLoader<GeminiSettings>(
    GeminiSettings.docName,
    GeminiSettings.getDocPath(),
    React.useCallback(createGeminiSettings, []),
  );
};
