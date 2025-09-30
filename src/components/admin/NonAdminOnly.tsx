import React from 'react';
import { useShowAdmin } from '../hooks/useShowAdmin';

interface Props {
  children: React.ReactNode;
}

export const NonAdminOnly = (props: Props) => {
  const showAdmin = useShowAdmin();
  if (!showAdmin) {
    return <>{props.children}</>;
  }
  return <></>;
};
