import React, { JSX } from 'react';
import { useLocalStorage } from 'react-storage-complete';
import { useKeywordSearchState } from '../../../hooks/useKeywordSearchState';
import { Alert, Button, ButtonGroup, Form, InputGroup, ListGroup, ProgressBar, Spinner, Table } from 'react-bootstrap';
import Bottleneck from 'bottleneck';

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
  const [combos, setCombos] = useLocalStorage<string[]>('sandbox.keywordResearch.combos', [
    'KEYWORD *',
    '* KEYWORD',
    'best KEYWORD *',
    'KEYWORD best *',
  ]);
  const [newCombo, setNewCombo] = React.useState('KEYWORD *');
  const [isScanning, setIsScanning] = React.useState(false);
  const [progressCount, setProgressCount] = React.useState(0);
  const [progressTotal, setProgressTotal] = React.useState(0);
  const [scanErrors, setScanErrors] = React.useState(0);
  const cancelRef = React.useRef(false);
  const scanIdRef = React.useRef(0);
  const [lastError, setLastError] = React.useState<string | null>(null);

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
        reject(new Error(`Request failed. Likely caused by too many requests.`));
      };
      document.head.appendChild(script);

      timeoutHandle = setTimeout(() => {
        cleanup();
        reject(new Error(`JSONP request timed out after ${timeoutMillis}ms for ${jsonpUrl}`));
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

  const isValidCombo = (c: string): boolean => {
    const s = (c ?? '').trim();
    return s.includes('KEYWORD') && s.includes('*');
  };

  const handleAddCombo = (): void => {
    const c = (newCombo ?? '').trim();
    if (!isValidCombo(c)) {
      setError('Combo must include KEYWORD and *');
      return;
    }
    setError(null);
    const next = Array.from(new Set([...(combos ?? []), c]));
    setCombos(next);
    setNewCombo('KEYWORD *');
  };

  const handleDeleteCombo = (idx: number): void => {
    const next = (combos ?? []).filter((_, i) => i !== idx);
    setCombos(next);
  };

  const deepScanAsync = async (): Promise<void> => {
    const baseKeyword = (keyword ?? '').trim();
    if (!baseKeyword) {
      setError('Please enter a keyword.');
      return;
    }
    const validCombos = (combos ?? []).filter(isValidCombo);
    if (validCombos.length === 0) {
      setError('Please add at least one valid combo.');
      return;
    }

    setIsScanning(true);
    setIsLoading(true);
    setError(null);
    cancelRef.current = false;
    const myScanId = ++scanIdRef.current;
    setProgressCount(0);
    setProgressTotal(0);
    setScanErrors(0);
    setLastError(null);
    // Reset suggestions for a fresh deep scan
    setSuggestions([]);
    setStoredSuggestions([]);

    // Expand combos → scan keywords
    const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode('a'.charCodeAt(0) + i));
    const scanKeywords: { q: string; letter: string }[] = [];
    for (const combo of validCombos) {
      for (const ch of alphabet) {
        const s1 = (combo || '').split('KEYWORD').join(baseKeyword);
        scanKeywords.push({ q: s1.split('*').join(ch), letter: ch });
      }
    }
    setProgressTotal(scanKeywords.length);

    const unique = new Set<string>();

    const limiter = new Bottleneck({ maxConcurrent: 2, minTime: 300 });

    const runOne = async ({ q, letter }: { q: string; letter: string }): Promise<void> => {
      if (cancelRef.current || scanIdRef.current !== myScanId) {
        return;
      }
      const lang = (navigator?.language || 'en').split('-')[0] || 'en';
      const baseUrl = `${YT_AUTOCOMPLETE_ENDPOINT}?client=youtube&ds=yt&hl=${encodeURIComponent(lang)}&q=${encodeURIComponent(q)}`;
      let attempts = 0;
      const maxAttempts = 100000;
      while (attempts < maxAttempts && !cancelRef.current) {
        try {
          console.log('Running one', q);
          const data = await loadJsonpAsync(baseUrl, 'callback');
          const list = parseSuggestions(data).filter((s) => {
            const sLower = String(s).toLowerCase();
            const qLower = q.toLowerCase();
            if (sLower.includes(qLower)) {
              // Allow if wildcard letter was 'a' or 'i'; otherwise skip
              return letter === 'a' || letter === 'i';
            }
            return true;
          });
          for (const s of list) {
            unique.add(String(s));
          }
          break;
        } catch (_e) {
          attempts += 1;
          setScanErrors((prev) => prev + 1);
          try {
            const msg = _e instanceof Error ? _e.message : String(_e);
            setLastError(msg);
          } catch {
            // ignore
          }
        } finally {
          const baseDelay = 500; // ms
          const jitter = Math.floor(Math.random() * 200); // ms
          const maxBackoff = 5000; // ms cap
          const exp = Math.min(maxBackoff, baseDelay * Math.pow(2, Math.max(0, attempts - 1)));
          const finalDelay = exp + jitter;
          console.log('Delay', finalDelay, 'ms');
          await new Promise((r) => setTimeout(r, finalDelay));
        }
      }
      if (scanIdRef.current === myScanId) {
        setProgressCount((prev) => prev + 1);
        const next = Array.from(unique);
        setSuggestions(next);
        setStoredSuggestions(next);
      }
    };

    try {
      await Promise.all(scanKeywords.map((item) => limiter.schedule(() => runOne(item))));
    } finally {
      setIsScanning(false);
      setIsLoading(false);
    }
  };

  const handleCancelScan = (): void => {
    cancelRef.current = true;
    scanIdRef.current += 1; // invalidate in-flight updates
    setIsScanning(false);
    setIsLoading(false);
    setLastError(null);
  };

  // One-off auto fetch disabled; deep scan only.

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
        <Button
          variant="primary"
          onClick={deepScanAsync}
          disabled={
            isLoading || isScanning || !(keyword ?? '').trim() || (combos ?? []).filter(isValidCombo).length === 0
          }
        >
          {isLoading || isScanning ? (
            <span className="d-flex align-items-center gap-2">
              <Spinner animation="border" size="sm" role="status" />
              <span>Deep Scanning...</span>
            </span>
          ) : (
            'Deep Scan'
          )}
        </Button>
        <Button
          variant="outline-secondary"
          className="ms-2"
          onClick={() => {
            setSuggestions([]);
            setStoredSuggestions([]);
            setProgressCount(0);
            setProgressTotal(0);
            setScanErrors(0);
          }}
          disabled={!suggestions.length && progressCount === 0}
        >
          Clear
        </Button>
      </InputGroup>
      {(isScanning || progressCount > 0) && (
        <div className="mb-2">
          <ProgressBar
            now={progressTotal ? Math.round((progressCount / progressTotal) * 100) : 0}
            label={`${progressTotal ? Math.round((progressCount / progressTotal) * 100) : 0}%`}
            animated={isScanning}
            striped={isScanning}
          />
          <div className="small text-muted mt-1 d-flex justify-content-between">
            <span>
              Completed: {progressCount} / {progressTotal}
              {progressTotal ? ` (${Math.round((progressCount / progressTotal) * 100)}%)` : ''}
            </span>
            <span>Errors: {scanErrors}</span>
            <Button size="sm" variant="outline-secondary" onClick={handleCancelScan} disabled={!isScanning}>
              Cancel
            </Button>
          </div>
          {scanErrors > 0 && (
            <Alert variant="warning" className="mt-2 mb-0">
              {scanErrors} request(s) failed.{lastError ? ` Last error: ${lastError}` : ''}
            </Alert>
          )}
        </div>
      )}
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

      {/* Combo Manager */}
      <div className="mt-4">
        <h5 className="mb-2">Combo Manager</h5>
        <div className="text-muted small mb-2">
          Use KEYWORD and * in your combo. * expands to a–z. Example: "best KEYWORD *"
        </div>
        <InputGroup className="mb-2" style={{ maxWidth: 520 }}>
          <Form.Control placeholder="e.g., KEYWORD *" value={newCombo} onChange={(e) => setNewCombo(e.target.value)} />
          <Button variant="outline-primary" onClick={handleAddCombo} disabled={!isValidCombo(newCombo)}>
            Add
          </Button>
        </InputGroup>
        <ListGroup style={{ maxWidth: 520 }}>
          {(combos ?? []).map((c, idx) => (
            <ListGroup.Item key={`combo-${idx}`} className="d-flex justify-content-between align-items-center">
              <span className="text-monospace">{c}</span>
              <ButtonGroup>
                <Button size="sm" variant="outline-danger" onClick={() => handleDeleteCombo(idx)}>
                  Delete
                </Button>
              </ButtonGroup>
            </ListGroup.Item>
          ))}
          {!(combos ?? []).length && <ListGroup.Item className="text-muted">No combos yet.</ListGroup.Item>}
        </ListGroup>
      </div>
    </div>
  );
};
