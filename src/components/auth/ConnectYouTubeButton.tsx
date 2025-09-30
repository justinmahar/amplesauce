import { useGoogleLogin } from '@react-oauth/google';
import React, { JSX } from 'react';
import { Alert, ButtonProps, Spinner } from 'react-bootstrap';
import { FaYoutube } from 'react-icons/fa';
import { useUserAccountContext } from '../contexts/UserAccountProvider';
import { auth } from '../firebase/firebase-app';
import { IconButton } from '../misc/IconButton';
import { useSiteSettingsContext } from '../contexts/SiteSettingsProvider';

// Constants
const YOUTUBE_READONLY_SCOPE = 'https://www.googleapis.com/auth/youtube.readonly';

// Types/Interfaces
export interface ConnectYouTubeButtonProps extends ButtonProps {
  onSuccess?: (tokenResponse: any) => void;
  onFailure?: (error: any) => void;
}

/**
 * A button that allows a user to connect their YouTube channel.
 * This button uses the @react-oauth/google library to get a one-time
 * access token to fetch their channel list on the backend, without
 * affecting their primary Firebase login.
 */
export const ConnectYouTubeButton = ({
  onSuccess,
  onFailure,
  ...buttonProps
}: ConnectYouTubeButtonProps): JSX.Element | null => {
  // State
  const { user } = useUserAccountContext();
  const siteSettings = useSiteSettingsContext();
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | undefined>(undefined);

  const doOnSuccess = onSuccess || (() => undefined);
  const doOnFailure = onFailure || (() => undefined);

  const googleLogin = useGoogleLogin({
    scope: YOUTUBE_READONLY_SCOPE,
    onSuccess: async (tokenResponse) => {
      doOnSuccess(tokenResponse);
      await handleBackendConnection(tokenResponse.access_token);
    },
    onError: (errorResponse) => {
      console.error('Google login error:', errorResponse);
      const errorMessage =
        typeof errorResponse === 'string'
          ? errorResponse
          : errorResponse.error_description || 'An unknown error occurred during Google sign-in.';
      setError(errorMessage);
      doOnFailure(errorResponse);
      setIsConnecting(false);
    },
  });

  // Handlers
  const handleBackendConnection = async (googleAccessToken: string) => {
    if (!auth?.currentUser) {
      // This should theoretically never happen if the button is only shown to logged-in users.
      throw new Error('User is not authenticated.');
    }

    try {
      const idToken = await auth.currentUser.getIdToken();

      const functionUrl = `${siteSettings?.data.settingsYaml.edgeFunctionsRoot}/api/connect-youtube-channel`;
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ googleAccessToken }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to connect channels.');
      }

      setSuccessMessage(responseData.message || 'Channels connected successfully!');
    } catch (e: any) {
      console.error('Error during backend connection:', e);
      setError(e.message || 'An unexpected error occurred.');
      doOnFailure(e);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleClick = () => {
    setError(undefined);
    setSuccessMessage(undefined);
    setIsConnecting(true);
    googleLogin();
  };

  // Render
  if (!user) return null; // Don't show if not logged in.

  return (
    <>
      {error && (
        <Alert variant="danger" className="my-2" onClose={() => setError(undefined)} dismissible>
          {error}
        </Alert>
      )}
      {successMessage && (
        <Alert variant="success" className="my-2" onClose={() => setSuccessMessage(undefined)} dismissible>
          {successMessage}
        </Alert>
      )}
      <IconButton
        {...buttonProps}
        icon={FaYoutube}
        variant="danger"
        onClick={handleClick}
        disabled={isConnecting || buttonProps.disabled}
      >
        {isConnecting && <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />}
        {isConnecting ? ' Connecting...' : 'Connect YouTube Channel'}
      </IconButton>
    </>
  );
};
