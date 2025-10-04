import { CollectionReference, DocumentData, query } from 'firebase/firestore';
import React from 'react';
import { DocData, DocDataAccessor } from './DocDataAccessor';
import { CollectionLoader, useCollectionLoader } from '../useCollectionLoader';
import { DocLoader, useDocLoader } from '../useDocLoader';
import { Workspace } from './Workspace';

export enum WorkspaceChannelFields {
  name = 'n',
  channelUrl = 'u',
}

export interface WorkspaceChannelData {
  [WorkspaceChannelFields.name]: string;
  [WorkspaceChannelFields.channelUrl]: string;
}

export class WorkspaceChannel extends DocDataAccessor {
  public static defaults: WorkspaceChannelData = {
    [WorkspaceChannelFields.name]: '',
    [WorkspaceChannelFields.channelUrl]: '',
  };

  public static collectionName = 'channels';

  constructor(uid: string, data: DocData, workspaceUid: string) {
    super(uid, data, WorkspaceChannel.getWorkspaceChannelCollectionPath(workspaceUid));
  }

  public getName(): string {
    return this.getValue(this.getData()[WorkspaceChannelFields.name], WorkspaceChannel.defaults.n);
  }

  public setName(name: string): Promise<boolean> {
    return this.update({ [WorkspaceChannelFields.name]: name });
  }

  public getChannelUrl(): string {
    return this.getValue(this.getData()[WorkspaceChannelFields.channelUrl], WorkspaceChannel.defaults.u);
  }

  public setChannelUrl(channelUrl: string): Promise<boolean> {
    return this.update({ [WorkspaceChannelFields.channelUrl]: channelUrl });
  }

  // ---- STATIC -------------------------------------------------------------
  public static getWorkspaceChannelCollectionPath(workspaceUid: string): string {
    return `${Workspace.getWorkspaceDocPath(workspaceUid)}/${WorkspaceChannel.collectionName}`;
  }

  public static getWorkspaceChannelDocPath(workspaceUid: string, uid?: string): string {
    return DocDataAccessor.getCollectionDocPath(
      WorkspaceChannel.getWorkspaceChannelCollectionPath(workspaceUid),
      `${uid}`,
    );
  }
}

const createWorkspaceChannel = (uid: string, data: DocData, workspaceUid: string) =>
  new WorkspaceChannel(uid, data, workspaceUid);

/** Loads a single WorkspaceChannel. */
export const useWorkspaceChannel = (workspaceUid: string, uid?: string): DocLoader<WorkspaceChannel> => {
  return useDocLoader<WorkspaceChannel>(
    uid,
    WorkspaceChannel.getWorkspaceChannelDocPath(workspaceUid, uid),
    React.useCallback((id: string, data: DocData) => createWorkspaceChannel(id, data, workspaceUid), [workspaceUid]),
  );
};

/** Loads a collection of WorkspaceChannels. */
export const useWorkspaceChannels = (
  workspaceUid?: string,
  q: (collRef?: CollectionReference<DocumentData>) => CollectionReference<DocumentData> | undefined = (collRef) =>
    collRef,
): CollectionLoader<WorkspaceChannel> => {
  return useCollectionLoader(
    workspaceUid ? WorkspaceChannel.getWorkspaceChannelCollectionPath(workspaceUid) : undefined,
    React.useCallback(q, []),
    React.useCallback(
      (id: string, data: DocData) => createWorkspaceChannel(id, data, `${workspaceUid}`),
      [workspaceUid],
    ),
  );
};
