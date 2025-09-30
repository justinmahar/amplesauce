import React from 'react';
import { runFlow } from 'genkit/beta/client';
import { useUserAccountContext } from '../contexts/UserAccountProvider';
import { useUserSettingsContext } from '../contexts/UserSettingsProvider';
import { useSiteSettingsContext } from '../contexts/SiteSettingsProvider';
import { VideoSchema } from '../genkit/VideoSchema';

// Types/Interfaces
interface SendMessageArgs {
  prompt?: string;
}

export interface GenkitChatStreamResponse {
  chatId: string;
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

/**
 * Manages the client-side logic for interacting with the Genkit chat API endpoint.
 * This hook is responsible for sending user prompts and returning the AI's response.
 */
export const useChat = () => {
  // State
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [response, setResponse] = React.useState<GenkitChatStreamResponse | null>(null);

  // Contexts
  const { user } = useUserAccountContext();
  const { userSettings } = useUserSettingsContext();
  const settings = useSiteSettingsContext();

  const endpointUrl = React.useMemo(() => {
    return settings?.data?.settingsYaml?.promptEndpoint;
  }, [settings]);

  // Handlers
  const sendMessage = async (args: SendMessageArgs) => {
    if (!user) {
      setError('User is not authenticated.');
      return;
    }
    if (!settings?.data) {
      setError('Site settings are not available.');
      return;
    }
    if (!userSettings) {
      setError('User settings not available.');
      return;
    }
    if (!endpointUrl) {
      setError('Chat endpoint is not configured.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const authToken = userSettings.getAuthToken();
      const userUid = user.uid;

      const result = await runFlow({
        url: endpointUrl,
        input: {
          ...args,
          userUid,
          authToken,
          schema: JSON.stringify(VideoSchema),
        },
      });

      setResponse(result as GenkitChatStreamResponse);
      console.log('Genkit chat response:', result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error('Genkit chat error:', message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Return hook's public API
  return {
    sendMessage,
    isLoading,
    response,
    error,
  };
};
