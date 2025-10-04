import { useLocalStorage } from 'react-storage-complete';

export const useThumbsIoApiKey = () => {
  return useLocalStorage<string>('sandbox.thumbsio.apiKey', '', {});
};
