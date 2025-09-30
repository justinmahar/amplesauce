import {
  collection,
  CollectionReference,
  doc,
  DocumentData,
  Firestore,
  getFirestore,
  query,
  Query,
  Timestamp,
} from 'firebase/firestore';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { CollectionLoader, useCollectionLoader } from '../useCollectionLoader';
import { DocDataAccessor } from './DocDataAccessor';
import { DocLoader, useDocLoader } from '../useDocLoader';

export const channelCollectionName = 'channels';

// Types/Interfaces
export interface ChannelInfo {
  id: string;
  title: string;
  thumbnailUrl: string;
}

export interface VideoInfo {
  id: string;
  title: string;
  description: string;
  publishedAt: number;
  thumbnailUrl: string;
  viewCount: string;
}

export interface LatestScan {
  scannedAt: number;
  videos: VideoInfo[];
}

export enum ChannelFields {
  channelData = 'channelData',
  latestScan = 'latestScan',
}

export interface ChannelDocumentData extends DocumentData {
  [ChannelFields.channelData]: ChannelInfo;
  [ChannelFields.latestScan]: LatestScan;
}

export const ChannelDefaults: ChannelDocumentData = {
  [ChannelFields.channelData]: {
    id: '',
    title: '',
    thumbnailUrl: '',
  },
  [ChannelFields.latestScan]: {
    scannedAt: 0,
    videos: [],
  },
};

export class Channel extends DocDataAccessor {
  public getChannelData = (): ChannelInfo => {
    return this.getValue(this.getData()[ChannelFields.channelData], ChannelDefaults.channelData);
  };

  public setChannelData = (channelData: ChannelInfo): Promise<boolean> => {
    return this.update({ [ChannelFields.channelData]: channelData });
  };

  public getLatestScan = (): LatestScan => {
    return this.getValue(this.getData()[ChannelFields.latestScan], ChannelDefaults.latestScan);
  };

  public setLatestScan = (latestScan: LatestScan): Promise<boolean> => {
    return this.update({ [ChannelFields.latestScan]: latestScan });
  };

  // --- Static ---
  public static getChannelCollectionPath(): string {
    return channelCollectionName;
  }

  public static getChannelDocPath(uid: string): string {
    return `${Channel.getChannelCollectionPath()}/${uid}`;
  }
}

export const createChannel = (uid: string, data: DocumentData | undefined): Channel => {
  return new Channel(uid, data ?? {}, Channel.getChannelCollectionPath());
};

export const useChannelLoader = (uid: string): DocLoader<Channel> => {
  return useDocLoader<Channel>(uid, Channel.getChannelDocPath(uid), (id: string, data: DocumentData) =>
    createChannel(id, data),
  );
};

export const useChannelsLoader = (
  q: (
    collRef?: CollectionReference<DocumentData>,
  ) => Query<DocumentData> | CollectionReference<DocumentData> | undefined = (collRef) => collRef,
): CollectionLoader<Channel> => {
  return useCollectionLoader<Channel>(Channel.getChannelCollectionPath(), q, (id: string, data: DocumentData) =>
    createChannel(id, data),
  );
};
