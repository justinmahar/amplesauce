import { useLocalStorage } from 'react-storage-complete';

export const usePexelsApiKey = () => {
  return useLocalStorage<string>('sandbox.pexels.apiKey', '', {});
};
