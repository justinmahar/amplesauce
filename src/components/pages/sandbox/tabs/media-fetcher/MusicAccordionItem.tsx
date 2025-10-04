import React from 'react';
import { Accordion, Alert, Button, Card, Col, Form, Row, InputGroup } from 'react-bootstrap';
import { useElevenLabsApiKey } from '../../../../../hooks/useElevenLabsApiKey';
import { useLocalSettingsContext } from '../../../../contexts/LocalSettingsProvider';
import { LocalSettingsKeys } from '../../../../settings/LocalSettings';

export type MusicAccordionItemProps = { eventKey: string };

export const MusicAccordionItem = ({ eventKey }: MusicAccordionItemProps): React.JSX.Element => {
  const [apiKey, setApiKey] = useElevenLabsApiKey();
  const localSettings = useLocalSettingsContext();

  // State
  const [prompt, setPrompt] = localSettings[LocalSettingsKeys.elevenLabsMusicPrompt];
  const [durationSecs, setDurationSecs] = localSettings[LocalSettingsKeys.elevenLabsMusicLengthSecs];
  const [isInstrumental, setIsInstrumental] = localSettings[LocalSettingsKeys.elevenLabsMusicForceInstrumental];
  const [outputFormat, setOutputFormat] = localSettings[LocalSettingsKeys.elevenLabsMusicOutputFormat];

  const [isGenerating, setIsGenerating] = React.useState<boolean>(false);
  const [audioUrl, setAudioUrl] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleGenerateAsync = React.useCallback(async (): Promise<void> => {
    setErrorMessage(null);
    if (!apiKey || String(apiKey).length === 0) {
      setErrorMessage('Please enter your ElevenLabs API key.');
      return;
    }
    if (!prompt || prompt.trim().length === 0) {
      setErrorMessage('Please enter a music prompt.');
      return;
    }
    setIsGenerating(true);
    try {
      const composeUrl = new URL('https://api.elevenlabs.io/v1/music');
      if (outputFormat) {
        composeUrl.searchParams.set('output_format', String(outputFormat));
      }
      const resp = await fetch(composeUrl.toString(), {
        method: 'POST',
        headers: {
          'xi-api-key': String(apiKey),
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          prompt,
          music_length_ms: Math.min(300000, Math.max(10000, Math.round(Number(durationSecs ?? 30) * 1000))),
          force_instrumental: Boolean((isInstrumental ?? true) as boolean),
          model_id: 'music_v1',
        }),
      });
      if (!resp.ok) {
        const maybeText = await resp.text();
        throw new Error(`Music generation failed (${resp.status}): ${maybeText}`);
      }
      const blob = await resp.blob();
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      const objectUrl = URL.createObjectURL(blob);
      setAudioUrl(objectUrl);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Unknown error during music generation');
    } finally {
      setIsGenerating(false);
    }
  }, [apiKey, prompt, durationSecs, isInstrumental, outputFormat, audioUrl]);

  return (
    <Accordion.Item eventKey={eventKey}>
      <Accordion.Header>Music — ElevenLabs</Accordion.Header>
      <Accordion.Body>
        <Card className="mb-3">
          <Card.Body>
            {errorMessage && (
              <Alert variant="danger" className="mb-3">
                {errorMessage}
              </Alert>
            )}
            <Row className="g-2">
              <Col md={12}>
                <Form.Group controlId="musicApiKey">
                  <Form.Label>ElevenLabs API Key</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="password"
                      placeholder="Enter your ElevenLabs API key..."
                      value={String(apiKey ?? '')}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={8}>
                <Form.Group controlId="musicPrompt">
                  <Form.Label>Prompt</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Describe the music (style, instruments, vibe)..."
                    value={String(prompt ?? '')}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Row className="g-2">
                  <Col md={12}>
                    <Form.Group controlId="musicDuration">
                      <Form.Label>Duration ({Number(durationSecs ?? 30)}s)</Form.Label>
                      <Form.Range
                        min={5}
                        max={180}
                        step={5}
                        value={Number(durationSecs ?? 30)}
                        onChange={(e) => setDurationSecs(Number(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group controlId="musicInstrumental">
                      <Form.Check
                        type="switch"
                        label="Instrumental (no vocals)"
                        checked={Boolean((isInstrumental ?? true) as boolean)}
                        onChange={(e) => setIsInstrumental(e.currentTarget.checked)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
              <Col md={6}>
                <Form.Group controlId="musicOutputFormat">
                  <Form.Label>Output format</Form.Label>
                  <Form.Select
                    value={String(outputFormat ?? 'mp3_44100_128')}
                    onChange={(e) => setOutputFormat(e.target.value)}
                  >
                    <option value="mp3_22050_32">MP3 — 22.05 kHz / 32 kbps</option>
                    <option value="mp3_44100_32">MP3 — 44.1 kHz / 32 kbps</option>
                    <option value="mp3_44100_64">MP3 — 44.1 kHz / 64 kbps</option>
                    <option value="mp3_44100_96">MP3 — 44.1 kHz / 96 kbps</option>
                    <option value="mp3_44100_128">MP3 — 44.1 kHz / 128 kbps (default)</option>
                    <option value="mp3_44100_192">MP3 — 44.1 kHz / 192 kbps</option>
                    <option value="pcm_8000">PCM — 8 kHz</option>
                    <option value="pcm_16000">PCM — 16 kHz</option>
                    <option value="pcm_22050">PCM — 22.05 kHz</option>
                    <option value="pcm_24000">PCM — 24 kHz</option>
                    <option value="pcm_44100">PCM — 44.1 kHz</option>
                    <option value="pcm_48000">PCM — 48 kHz</option>
                    <option value="ulaw_8000">μ-law — 8 kHz</option>
                    <option value="alaw_8000">A-law — 8 kHz</option>
                    <option value="opus_48000_32">Opus — 48 kHz / 32 kbps</option>
                    <option value="opus_48000_64">Opus — 48 kHz / 64 kbps</option>
                    <option value="opus_48000_96">Opus — 48 kHz / 96 kbps</option>
                    <option value="opus_48000_128">Opus — 48 kHz / 128 kbps</option>
                    <option value="opus_48000_192">Opus — 48 kHz / 192 kbps</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              {/* Removed unsupported fields per official compose API */}
            </Row>
            <div className="mt-3 d-flex gap-2">
              <Button variant="primary" onClick={handleGenerateAsync} disabled={isGenerating}>
                {isGenerating ? 'Generating…' : 'Generate Music'}
              </Button>
            </div>
            {audioUrl && (
              <div className="mt-3">
                <audio controls src={audioUrl} />
                <div>
                  <a href={audioUrl} download="music-output">
                    Download audio
                  </a>
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      </Accordion.Body>
    </Accordion.Item>
  );
};
