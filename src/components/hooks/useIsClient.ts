import React from 'react';

/**
 * Use to avoid hydration issues. See: https://blog.logrocket.com/fixing-gatsbys-rehydration-issue/
 */
export const useIsClient = () => {
  const [isClient, setClient] = React.useState(false);
  const key = isClient ? 'client' : 'server';

  React.useEffect(() => {
    setClient(true);
  }, []);

  return { isClient, key };
};
