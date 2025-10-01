import React, { JSX } from 'react';
import {
  Alert,
  Button,
  Form,
  InputGroup,
  Spinner,
  Table,
  Badge,
  Accordion,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import { streamFlow } from 'genkit/beta/client';
import { useUserAccountContext } from '../../../contexts/UserAccountProvider';
import { useUserSettingsContext } from '../../../contexts/UserSettingsProvider';
import { useLocalStorage } from 'react-storage-complete';
import { FaQuestionCircle, FaCheckCircle } from 'react-icons/fa';
import { useSandboxTab } from '../../../hooks/useSandboxTab';
import { useKeywordSearchState } from '../../../hooks/useKeywordSearchState';
import { useContentResearchState } from '../../../hooks/useContentResearchState';

export type NicheHunterTabProps = Record<string, never>;

export const NicheHunterTab = (_props: NicheHunterTabProps): JSX.Element => {
  const [niche, setNiche] = useLocalStorage<string>('sandbox.nicheHunter.niche', '');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [limitValue, setLimitValue] = React.useState<string>('20');
  const [traces, setTraces] = React.useState<string[]>([]);
  const [message, setMessage] = React.useState<string | null>(null);
  const [showHelp, setShowHelp] = React.useState<boolean>(true);
  type Idea = {
    nm?: string;
    rp?: number;
    af?: number;
    sp?: number;
    mk?: number;
    mv?: number;
    st?: number;
    eg?: number;
    pp?: number;
    en?: number;
    kw?: string;
  };
  type ScoredIdea = Idea & { score: number };
  const [ideas, setIdeas] = React.useState<ScoredIdea[]>([]);
  const [storedIdeas, setStoredIdeas, ideasInitialized] = useLocalStorage<ScoredIdea[]>(
    'sandbox.nicheHunter.ideas',
    [],
  );

  const { user } = useUserAccountContext();
  const { userSettings } = useUserSettingsContext();
  const { setTab } = useSandboxTab();
  const { setKeyword } = useKeywordSearchState();
  const { setIdea } = useContentResearchState();

  const NICHE_HUNTER_ENDPOINT = 'https://nichehunter-zydnejjbcq-uc.a.run.app';
  const DEFAULT_NICHE_PROMPT = 'viable niches spanning diverse categories';

  // Calculate composite score for an idea (robust to undefined/partial values)
  const calculateIdeaScore = (idea: Idea): number => {
    const weights = {
      af: 1,
      sp: 1,
      eg: 1,
      pp: 1,
      en: 1,
      st: 1, // used inversely
      rp: 1,
      mk: 1,
      mv: 1,
    } as const;

    const discrete =
      (idea?.af ?? 0) * weights.af +
      (idea?.sp ?? 0) * weights.sp +
      (idea?.eg ?? 0) * weights.eg +
      (idea?.pp ?? 0) * weights.pp +
      (idea?.en ?? 0) * weights.en;
    const saturationInverse = (2 - (idea?.st ?? 0)) * weights.st;
    const rpmComponent = Math.log10((idea?.rp ?? 0) + 1) * weights.rp;
    const marketComponent = Math.log10((idea?.mk ?? 0) + 1) * weights.mk;
    const volComponent = Math.log10((idea?.mv ?? 0) + 1) * weights.mv;
    return Number((discrete + saturationInverse + rpmComponent + marketComponent + volComponent).toFixed(3));
  };

  const handleGo = async () => {
    const requestedNiche = (niche ?? '').trim() || DEFAULT_NICHE_PROMPT;
    if (!user) {
      setError('Please log in to use Niche Hunter.');
      return;
    }
    if (!userSettings) {
      setError('User settings not available.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setIdeas([]);
    setTraces([]);
    try {
      const authToken = userSettings.getAuthToken();
      const userUid = user.uid;

      const parsedLimit = Number.parseInt(limitValue, 10);
      const limit = Number.isFinite(parsedLimit) ? Math.min(50, Math.max(1, parsedLimit)) : 10;

      const result = streamFlow({
        url: NICHE_HUNTER_ENDPOINT,
        input: {
          niche: requestedNiche,
          strategy: 'nicheDown',
          limit,
          userUid,
          authToken,
        },
      });

      // Consume streaming chunks – backend sends { type: 'ideas', ideas: Idea[] } where the array grows over time
      for await (const chunk of result.stream) {
        try {
          const json = JSON.parse(chunk);
          if (json.type === 'trace' && typeof json.trace === 'string') {
            setTraces((prev) => [...prev, json.trace as string]);
          } else if (json.type === 'output') {
            const streamedIdeas = (json.output?.ideas ?? []) as Idea[];
            const scored = streamedIdeas.map((i) => ({ ...i, score: calculateIdeaScore(i) })) as ScoredIdea[];
            scored.sort((a, b) => b.score - a.score);
            setIdeas(scored);
            setStoredIdeas(scored);
          }
          // Streamed message can be present either at top-level or inside output
          const streamedMessage: unknown =
            typeof json?.message === 'string'
              ? json.message
              : typeof json?.output?.message === 'string'
                ? json.output.message
                : undefined;
          if (typeof streamedMessage === 'string' && streamedMessage.length > 0) {
            setMessage(streamedMessage);
          }
        } catch (_e) {
          // ignore parse errors for robustness
        }
      }

      // Fetch final output
      const finalOutput = await result.output;
      const finalIdeas = (finalOutput.ideas ?? []) as Idea[];
      const scoredFinal = finalIdeas.map((i) => ({ ...i, score: calculateIdeaScore(i) })) as ScoredIdea[];
      scoredFinal.sort((a, b) => b.score - a.score);
      setIdeas(scoredFinal);
      setStoredIdeas(scoredFinal);
      if (typeof (finalOutput as any)?.message === 'string') {
        setMessage((finalOutput as any).message as string);
      }
      if (finalOutput.error) {
        setError(finalOutput.error);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const getRatingBadge = (value: number | undefined, strategy?: 'inverse'): JSX.Element => {
    const v = typeof value === 'number' ? value : -1;
    const label = v === 0 ? 'Low' : v === 1 ? 'Medium' : v === 2 ? 'High' : '-';
    const variantMap =
      strategy === 'inverse'
        ? ({ 0: 'success', 1: 'warning', 2: 'danger' } as const)
        : ({ 0: 'danger', 1: 'warning', 2: 'success' } as const);
    const variant = v === 0 || v === 1 || v === 2 ? variantMap[v] : 'secondary';
    return (
      <Badge bg={variant} className={variant === 'warning' ? 'text-black' : undefined}>
        {label}
      </Badge>
    );
  };

  // Load from localStorage when available
  React.useEffect(() => {
    if (ideasInitialized && ideas.length === 0 && Array.isArray(storedIdeas) && storedIdeas.length > 0) {
      setIdeas(storedIdeas);
    }
  }, [ideasInitialized, storedIdeas, ideas.length]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
        <h2 className="mb-0">Niche Hunter</h2>
        {!showHelp && (
          <FaQuestionCircle className="text-muted cursor-pointer" title="Show help" onClick={() => setShowHelp(true)} />
        )}
      </div>
      {showHelp && (
        <Alert variant="info" className="mb-3" dismissible onClose={() => setShowHelp(false)}>
          Enter a broad niche to explore opportunities. Choose your strategy (in the next step) to niche down into more
          specific subniches or move sideways into adjacent subniches. Then click GO to generate ideas.
        </Alert>
      )}
      {!!message && (
        <Alert variant="secondary" className="mb-3">
          <span className="fw-bold small">Niche Hunter says:</span>
          <p className="mb-0">“{message}”</p>
        </Alert>
      )}
      <InputGroup className="mb-2">
        <Form.Control
          placeholder="Enter a niche (e.g., Fitness, Home Automation, Woodworking)"
          value={niche ?? ''}
          onChange={(e) => setNiche(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              void handleGo();
            }
          }}
          disabled={isLoading}
        />
        <InputGroup.Text>Count</InputGroup.Text>
        <Form.Control
          type="number"
          min={1}
          max={50}
          value={limitValue}
          onChange={(e) => setLimitValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              void handleGo();
            }
          }}
          disabled={isLoading}
          style={{ maxWidth: 120 }}
        />
        <Button variant="primary" onClick={handleGo} disabled={isLoading}>
          {isLoading ? (
            <span className="d-flex align-items-center gap-2">
              <Spinner animation="border" size="sm" role="status" />
              <span>Generating...</span>
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
      {!!ideas.length && (
        <div className="mt-3">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Score</th>
                <th>Name</th>
                <th>RPM</th>
                <th>Affiliate</th>
                <th>Sponsor</th>
                <th>Market (K)</th>
                <th>Monthly Vol (K)</th>
                <th>Saturation</th>
                <th>Evergreen</th>
                <th>Purchase Power</th>
                <th>Engagement</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ideas.map((idea, idx) => (
                <tr key={`${idea.nm ?? 'idea'}-${idx}`}>
                  <td>{Number.isFinite(idea.score) ? Math.round(idea.score) : '-'}</td>
                  <td>
                    <OverlayTrigger
                      placement="top"
                      delay={{ show: 0, hide: 0 }}
                      overlay={<Tooltip id={`kw-tip-${idx}`}>{idea.kw || 'No keyword'}</Tooltip>}
                    >
                      <span>{idea.nm ?? '-'}</span>
                    </OverlayTrigger>
                  </td>
                  <td>{Number.isFinite(Number(idea.rp)) ? `$${(idea.rp as number).toFixed(2)}` : '-'}</td>
                  <td>{getRatingBadge(Number.isFinite(Number(idea.af)) ? Number(idea.af) : undefined)}</td>
                  <td>{getRatingBadge(Number.isFinite(Number(idea.sp)) ? Number(idea.sp) : undefined)}</td>
                  <td>{Number.isFinite(Number(idea.mk)) ? idea.mk : '-'}</td>
                  <td>{Number.isFinite(Number(idea.mv)) ? `${Math.round(Number(idea.mv))}K` : '-'}</td>
                  <td>{getRatingBadge(Number.isFinite(Number(idea.st)) ? Number(idea.st) : undefined, 'inverse')}</td>
                  <td>{getRatingBadge(Number.isFinite(Number(idea.eg)) ? Number(idea.eg) : undefined)}</td>
                  <td>{getRatingBadge(Number.isFinite(Number(idea.pp)) ? Number(idea.pp) : undefined)}</td>
                  <td>{getRatingBadge(Number.isFinite(Number(idea.en)) ? Number(idea.en) : undefined)}</td>
                  <td className="text-nowrap">
                    <OverlayTrigger
                      placement="top"
                      delay={{ show: 0, hide: 0 }}
                      overlay={<Tooltip id={`kw-btn-${idx}`}>Send to Keyword Research</Tooltip>}
                    >
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="me-2"
                        onClick={() => {
                          setKeyword(idea.kw || idea.nm || '');
                          setTab('Keyword Research');
                        }}
                      >
                        🔎
                      </Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="top"
                      delay={{ show: 0, hide: 0 }}
                      overlay={<Tooltip id={`cr-btn-${idx}`}>Send to Content Research</Tooltip>}
                    >
                      <Button
                        size="sm"
                        variant="outline-success"
                        onClick={() => {
                          setIdea(idea.kw || idea.nm || '');
                          setTab('Content Research');
                        }}
                      >
                        📝
                      </Button>
                    </OverlayTrigger>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      {!!traces.length && (
        <div className="mt-3">
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <div className="d-flex align-items-center">
                  {isLoading ? (
                    <Spinner animation="border" size="sm" className="me-2" />
                  ) : (
                    <FaCheckCircle className="text-success me-2" />
                  )}
                  <span>Progress</span>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <ul className="ps-3 mb-0" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {traces.map((trace, idx) => (
                    <li key={`trace-${idx}`}>{trace}</li>
                  ))}
                </ul>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      )}
    </div>
  );
};
