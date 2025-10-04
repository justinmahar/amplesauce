import { DocumentData } from 'firebase-admin/firestore';
import { DocDataAccessor } from './DocDataAccessor';
import { workspaceCollectionName } from './Workspace';

export enum WorkspaceChannelFields {
  name = 'n',
  channelUrl = 'u',
}

export interface WorkspaceChannelData extends DocumentData {
  [WorkspaceChannelFields.name]: string;
  [WorkspaceChannelFields.channelUrl]: string;
}

export const WorkspaceChannelDefaults: WorkspaceChannelData = {
  [WorkspaceChannelFields.name]: '',
  [WorkspaceChannelFields.channelUrl]: '',
};

export class WorkspaceChannel extends DocDataAccessor {
  public getName = (): string => {
    return this.getValue(
      this.getData()[WorkspaceChannelFields.name],
      WorkspaceChannelDefaults[WorkspaceChannelFields.name],
    );
  };

  public setName = (name: string): Promise<boolean> => {
    return this.update({ [WorkspaceChannelFields.name]: name });
  };

  public getChannelUrl = (): string => {
    return this.getValue(
      this.getData()[WorkspaceChannelFields.channelUrl],
      WorkspaceChannelDefaults[WorkspaceChannelFields.channelUrl],
    );
  };

  public setChannelUrl = (channelUrl: string): Promise<boolean> => {
    return this.update({ [WorkspaceChannelFields.channelUrl]: channelUrl });
  };

  public static getWorkspaceChannelCollectionPath(workspaceUid: string): string {
    return `${workspaceCollectionName}/${workspaceUid}/channels`;
  }

  public static getWorkspaceChannelDocPath(workspaceUid: string, uid: string): string {
    return `${this.getWorkspaceChannelCollectionPath(workspaceUid)}/${uid}`;
  }
}
