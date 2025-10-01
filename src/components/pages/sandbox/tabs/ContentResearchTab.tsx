import React, { JSX } from 'react';
import { Alert, Button, Form, InputGroup, Spinner } from 'react-bootstrap';
import { runFlow } from 'genkit/beta/client';
import { useLocalStorage } from 'react-storage-complete';
import { useContentResearchState } from '../../../hooks/useContentResearchState';
import { useUserAccountContext } from '../../../contexts/UserAccountProvider';
import { useUserSettingsContext } from '../../../contexts/UserSettingsProvider';
import { Markdown } from '../../../markdown/Markdown';

export type ContentResearchTabProps = Record<string, never>;

interface ResearchResult {
  text?: string;
  groundingMetadata?: unknown;
  error?: string;
}

export const ContentResearchTab = (_props: ContentResearchTabProps): JSX.Element => {
  const { idea, setIdea } = useContentResearchState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [savedResult, setSavedResult] = useLocalStorage<ResearchResult>(
    'sandbox.contentResearch.result',
    {} as ResearchResult,
  );
  const [traces, setTraces] = React.useState<string[]>([]);

  const { user } = useUserAccountContext();
  const { userSettings } = useUserSettingsContext();

  const RESEARCH_ENDPOINT = 'https://research-zydnejjbcq-uc.a.run.app';

  const handleGo = async (): Promise<void> => {
    if (!user) {
      setError('Please log in to use Content Research.');
      return;
    }
    if (!userSettings) {
      setError('User settings not available.');
      return;
    }

    const authToken = userSettings.getAuthToken();
    const userUid = user.uid;
    const topic = (idea ?? '').trim();
    if (!topic) {
      setError('Please enter a video idea.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSavedResult({} as ResearchResult);
    setTraces([]);

    try {
      const result = await runFlow({
        url: RESEARCH_ENDPOINT,
        input: {
          idea: topic,
          userUid,
          authToken,
        },
      });

      const finalOutput = result as { text?: string; groundingMetadata?: unknown; error?: string };
      setSavedResult({
        text: finalOutput?.text,
        groundingMetadata: finalOutput?.groundingMetadata,
        error: finalOutput?.error,
      });
      if (finalOutput?.error) {
        setError(finalOutput.error);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-3">Content Research</h2>
      <InputGroup className="mb-2">
        <Form.Control
          placeholder="Enter a YouTube video idea/topic"
          value={idea ?? ''}
          onChange={(e) => setIdea(e.target.value)}
          disabled={isLoading}
        />
        <Button variant="primary" onClick={handleGo} disabled={isLoading}>
          {isLoading ? (
            <span className="d-flex align-items-center gap-2">
              <Spinner animation="border" size="sm" role="status" />
              <span>Researching...</span>
            </span>
          ) : (
            'GO'
          )}
        </Button>
      </InputGroup>
      {!!error && (
        <Alert variant="danger" className="mt-2">
          {error}
        </Alert>
      )}

      {!!savedResult?.text && (
        <Alert variant="primary" className="mt-3">
          <Markdown>{savedResult.text as string}</Markdown>
        </Alert>
      )}

      {savedResult?.groundingMetadata != null &&
        (() => {
          const searchHtml = (
            savedResult.groundingMetadata as unknown as { searchEntryPoint?: { renderedContent?: string } }
          )?.searchEntryPoint?.renderedContent;
          return (
            <Alert variant="secondary" className="mt-2" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              <div className="fw-bold mb-1">Citations</div>
              {searchHtml ? (
                <div dangerouslySetInnerHTML={{ __html: searchHtml }} />
              ) : (
                <pre className="mb-0">{JSON.stringify(savedResult.groundingMetadata, null, 2)}</pre>
              )}
            </Alert>
          );
        })()}

      {!!traces.length && (
        <Alert variant="secondary" className="mt-3" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          <div className="fw-bold mb-1">Trace</div>
          <ul className="ps-3 mb-0">
            {traces.map((t, idx) => (
              <li key={`trace-${idx}`}>{t}</li>
            ))}
          </ul>
        </Alert>
      )}
    </div>
  );
};
