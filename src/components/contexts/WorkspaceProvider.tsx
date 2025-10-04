import * as React from 'react';
import { ElementProps } from 'react-html-props';
import { useUserSettingsContext } from './UserSettingsProvider';
import { useWorkspace } from '../firebase/firestore/models/Workspace';
import { useWorkspaceChannels } from '../firebase/firestore/models/WorkspaceChannel';

export interface WorkspaceContextValue {
  workspaceLoader: ReturnType<typeof useWorkspace>;
  channelsLoader: ReturnType<typeof useWorkspaceChannels>;
}

const defaultValue: WorkspaceContextValue = {
  workspaceLoader: { model: undefined, loading: false, snapshot: undefined, error: undefined },
  channelsLoader: { models: [], loading: false, snapshot: undefined, error: undefined },
};

export const WorkspaceContext = React.createContext<WorkspaceContextValue>(defaultValue);

export const WorkspaceProvider = ({ children }: ElementProps): React.JSX.Element => {
  const userSettings = useUserSettingsContext();
  const currentWorkspaceUid = userSettings.userSettings?.getCurrentWorkspaceUid() ?? undefined;

  const workspaceLoader = useWorkspace(currentWorkspaceUid);
  const channelsLoader = useWorkspaceChannels(currentWorkspaceUid ?? '', (collRef) => collRef);

  const value = React.useMemo<WorkspaceContextValue>(() => {
    return {
      workspaceLoader,
      channelsLoader,
    };
  }, [workspaceLoader, channelsLoader]);

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
};
export const useWorkspaceContext = (): WorkspaceContextValue => React.useContext(WorkspaceContext);
