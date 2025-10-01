import React, { JSX } from 'react';
import { useLocalStorage } from 'react-storage-complete';
import { useKeywordSearchState } from '../../../hooks/useKeywordSearchState';
import { Alert, Button, Form, InputGroup, Spinner, Table } from 'react-bootstrap';

export type KeywordResearchTabProps = Record<string, never>;

export const KeywordResearchTab = (_props: KeywordResearchTabProps): JSX.Element => {
  const { keyword, setKeyword } = useKeywordSearchState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const latestRequestIdRef = React.useRef(0);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [storedSuggestions, setStoredSuggestions, suggestionsInitialized] = useLocalStorage<string[]>(
    'sandbox.keywordResearch.suggestions',
    [],
  );

  const YT_AUTOCOMPLETE_ENDPOINT = 'https://clients1.google.com/complete/search';

  // JSONP loader to bypass CORS for the unofficial YouTube suggest endpoint
  const loadJsonpAsync = (
    url: string,
    callbackParam: string = 'callback',
    timeoutMillis: number = 10000,
  ): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      const callbackName = `__ytSuggestCb_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
      const separator = url.includes('?') ? '&' : '?';
      const jsonpUrl = `${url}${separator}${callbackParam}=${encodeURIComponent(callbackName)}`;

      let timeoutHandle: ReturnType<typeof setTimeout> | null = null;
      const cleanup = () => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          delete (window as any)[callbackName];
        } catch {
          // ignore
        }
        if (script && script.parentNode) {
          script.parentNode.removeChild(script);
        }
        if (timeoutHandle) {
          clearTimeout(timeoutHandle);
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any)[callbackName] = (data: unknown) => {
        cleanup();
        resolve(data);
      };

      const script = document.createElement('script');
      script.src = jsonpUrl;
      script.async = true;
      script.onerror = () => {
        cleanup();
        reject(new Error('JSONP request failed'));
      };
      document.head.appendChild(script);

      timeoutHandle = setTimeout(() => {
        cleanup();
        reject(new Error('JSONP request timed out'));
      }, timeoutMillis);
    });
  };

  const parseSuggestions = (data: unknown): string[] => {
    // Expected JSONP payload: [ query: string, suggestions: (string[] | [string, ...][]) ]
    if (!Array.isArray(data)) {
      return [];
    }
    const raw = data[1];
    if (Array.isArray(raw) && raw.length > 0) {
      // Support both ["s1","s2", ...] and [["s1",0], ["s2",0], ...]
      if (typeof raw[0] === 'string') {
        return (raw as unknown[]).map((v) => String(v));
      }
      if (Array.isArray(raw[0])) {
        return (raw as unknown[])
          .map((v) => (Array.isArray(v) ? String((v as unknown[])[0] ?? '') : ''))
          .filter((s) => !!s);
      }
    }
    return [];
  };

  const fetchSuggestionsAsync = React.useCallback(
    async (q: string, showEmptyError: boolean): Promise<void> => {
      const query = (q ?? '').trim();
      if (!query) {
        if (showEmptyError) {
          setError('Please enter a keyword.');
          setSuggestions([]);
        }
        return;
      }

      const requestId = ++latestRequestIdRef.current;
      setIsLoading(true);
      setError(null);
      try {
        const lang = (navigator?.language || 'en').split('-')[0] || 'en';
        const baseUrl = `${YT_AUTOCOMPLETE_ENDPOINT}?client=youtube&ds=yt&hl=${encodeURIComponent(lang)}&q=${encodeURIComponent(query)}`;
        const data = await loadJsonpAsync(baseUrl, 'callback');
        if (requestId !== latestRequestIdRef.current) {
          return; // stale response
        }
        const suggestionsList = parseSuggestions(data);
        setSuggestions(suggestionsList);
        setStoredSuggestions(suggestionsList);
        inputRef.current?.focus();
      } catch (err) {
        if (requestId !== latestRequestIdRef.current) {
          return; // stale response
        }
        const message = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(message);
        setSuggestions([]);
        setStoredSuggestions([]);
        inputRef.current?.focus();
      } finally {
        if (requestId === latestRequestIdRef.current) {
          setIsLoading(false);
        }
      }
    },
    [setStoredSuggestions],
  );

  const handleGo = async (): Promise<void> => {
    await fetchSuggestionsAsync(keyword ?? '', true);
  };

  React.useEffect(() => {
    const handle = setTimeout(() => {
      void fetchSuggestionsAsync(keyword ?? '', false);
    }, 100);
    return () => clearTimeout(handle);
  }, [keyword, fetchSuggestionsAsync]);

  React.useEffect(() => {
    if (suggestionsInitialized && Array.isArray(storedSuggestions) && storedSuggestions.length > 0) {
      setSuggestions(storedSuggestions);
    }
  }, [suggestionsInitialized, storedSuggestions]);

  return (
    <div>
      <h2 className="mb-3">Keyword Research</h2>
      <InputGroup className="mb-2">
        <Form.Control
          ref={inputRef}
          placeholder="Enter a keyword (e.g., coffee grinder, gaming pc)"
          value={keyword ?? ''}
          onChange={(e) => setKeyword(e.target.value)}
          // disabled={isLoading}
        />
        <Button variant="primary" onClick={handleGo} disabled={isLoading}>
          {isLoading ? (
            <span className="d-flex align-items-center gap-2">
              <Spinner animation="border" size="sm" role="status" />
              <span>Fetching...</span>
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
      {!!suggestions.length && (
        <div className="mt-3">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Suggestion</th>
              </tr>
            </thead>
            <tbody>
              {suggestions.map((s, idx) => (
                <tr key={`${s}-${idx}`}>
                  <td>{idx + 1}</td>
                  <td>{s}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};
