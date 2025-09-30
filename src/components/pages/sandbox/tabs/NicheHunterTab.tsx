import React, { JSX } from 'react';
import { Alert, Button, Form, InputGroup, Spinner, Table } from 'react-bootstrap';
import { runFlow } from 'genkit/beta/client';
import { useUserAccountContext } from '../../../contexts/UserAccountProvider';
import { useUserSettingsContext } from '../../../contexts/UserSettingsProvider';

export type NicheHunterTabProps = Record<string, never>;

export const NicheHunterTab = (_props: NicheHunterTabProps): JSX.Element => {
  const [niche, setNiche] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  type Idea = {
    nm: string;
    rp: number;
    af: number;
    sp: number;
    mk: number;
    mv: number;
    st: number;
    eg: number;
    pp: number;
    en: number;
  };
  type ScoredIdea = Idea & { score: number };
  const [ideas, setIdeas] = React.useState<ScoredIdea[]>([]);

  const { user } = useUserAccountContext();
  const { userSettings } = useUserSettingsContext();

  const NICHE_HUNTER_ENDPOINT = 'https://nichehunter-zydnejjbcq-uc.a.run.app';
  const DEFAULT_NICHE_PROMPT = 'high-RPM, advertiser-friendly niches spanning diverse categories';

  // Calculate composite score for an idea
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
      idea.af * weights.af + idea.sp * weights.sp + idea.eg * weights.eg + idea.pp * weights.pp + idea.en * weights.en;
    const saturationInverse = (2 - Math.max(0, Math.min(2, idea.st))) * weights.st;
    const rpmComponent = Math.log10(Math.max(idea.rp, 0) + 1) * weights.rp;
    const marketComponent = Math.log10(Math.max(idea.mk, 0) + 1) * weights.mk;
    const volComponent = Math.log10(Math.max(idea.mv, 0) + 1) * weights.mv;
    return Number((discrete + saturationInverse + rpmComponent + marketComponent + volComponent).toFixed(3));
  };

  const handleGo = async () => {
    const requestedNiche = niche.trim() || DEFAULT_NICHE_PROMPT;
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
    try {
      const authToken = userSettings.getAuthToken();
      const userUid = user.uid;

      const result = await runFlow({
        url: NICHE_HUNTER_ENDPOINT,
        input: {
          niche: requestedNiche,
          strategy: 'nicheDown',
          limit: 10,
          userUid,
          authToken,
        },
      });

      const rawIdeas = (result as { ideas?: Idea[] }).ideas ?? [];
      const scored = rawIdeas.map((i) => ({ ...i, score: calculateIdeaScore(i) })) as ScoredIdea[];
      scored.sort((a, b) => b.score - a.score);
      setIdeas(scored);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-3">Niche Hunter</h2>
      <Alert variant="info" className="mb-3">
        Enter a broad niche to explore opportunities. Choose your strategy (in the next step) to niche down into more
        specific subniches or move sideways into adjacent subniches. Then click GO to generate ideas.
      </Alert>
      <InputGroup className="mb-2">
        <Form.Control
          placeholder="Enter a niche (e.g., Fitness, Home Automation, Woodworking)"
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          disabled={isLoading}
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
      {!!ideas.length && !isLoading && (
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
                <th>Monthly Vol</th>
                <th>Saturation</th>
                <th>Evergreen</th>
                <th>Purchase Power</th>
                <th>Engagement</th>
              </tr>
            </thead>
            <tbody>
              {ideas.map((idea, idx) => (
                <tr key={`${idea.nm}-${idx}`}>
                  <td>{idea.score}</td>
                  <td>{idea.nm}</td>
                  <td>{idea.rp}</td>
                  <td>{idea.af}</td>
                  <td>{idea.sp}</td>
                  <td>{idea.mk}</td>
                  <td>{idea.mv}</td>
                  <td>{idea.st}</td>
                  <td>{idea.eg}</td>
                  <td>{idea.pp}</td>
                  <td>{idea.en}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};
