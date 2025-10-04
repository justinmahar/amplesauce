import React from 'react';
import { Accordion, Alert, Button, Card, Col, Form, Row, InputGroup, Table } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useLocalSettingsContext } from '../../../../contexts/LocalSettingsProvider';
import { LocalSettingsKeys } from '../../../../settings/LocalSettings';
import { useElevenLabsApiKey } from '../../../../../hooks/useElevenLabsApiKey';

export type VoiceTtsAccordionItemProps = { eventKey: string };

export const VoiceTtsAccordionItem = ({ eventKey }: VoiceTtsAccordionItemProps): React.JSX.Element => {
  type VoiceSummary = {
    voice_id: string;
    name: string;
    category?: string;
    labels?: Record<string, string>;
  };
  type ModelSummary = {
    model_id: string;
    name?: string;
  };
  type TimingWord = {
    text: string;
    start: number; // seconds
    end: number; // seconds
  };

  const localSettings = useLocalSettingsContext();
  const [elevenLabsApiKey, setElevenLabsApiKey] = useElevenLabsApiKey();

  const [text, setText] = localSettings[LocalSettingsKeys.elevenLabsText];
  const [voices, setVoices] = React.useState<VoiceSummary[]>([]);
  const [models, setModels] = React.useState<ModelSummary[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = localSettings[LocalSettingsKeys.elevenLabsSelectedVoiceId];
  const [modelId, setModelId] = localSettings[LocalSettingsKeys.elevenLabsModelId];
  const [outputFormat, setOutputFormat] = localSettings[LocalSettingsKeys.elevenLabsOutputFormat];
  const [stability, setStability] = localSettings[LocalSettingsKeys.elevenLabsStability];
  const [similarityBoost, setSimilarityBoost] = localSettings[LocalSettingsKeys.elevenLabsSimilarityBoost];
  const [style, setStyle] = localSettings[LocalSettingsKeys.elevenLabsStyle];
  const [isSpeakerBoost, setIsSpeakerBoost] = localSettings[LocalSettingsKeys.elevenLabsUseSpeakerBoost];

  const [isLoadingVoices, setIsLoadingVoices] = React.useState<boolean>(false);
  const [isLoadingModels, setIsLoadingModels] = React.useState<boolean>(false);
  const [isSynthesizing, setIsSynthesizing] = React.useState<boolean>(false);
  const [audioUrl, setAudioUrl] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isApiKeyVisible, setIsApiKeyVisible] = React.useState<boolean>(false);
  const [isAligning, setIsAligning] = React.useState<boolean>(false);
  const [alignmentWords, setAlignmentWords] = React.useState<TimingWord[] | null>(null);
  const [alignmentError, setAlignmentError] = React.useState<string | null>(null);

  React.useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleLoadVoicesAsync = React.useCallback(async (): Promise<void> => {
    setErrorMessage(null);
    if (!elevenLabsApiKey || String(elevenLabsApiKey).length === 0) {
      setErrorMessage('Please enter your ElevenLabs API key.');
      return;
    }
    setIsLoadingVoices(true);
    try {
      const resp = await fetch('https://api.elevenlabs.io/v1/voices', {
        method: 'GET',
        headers: {
          'xi-api-key': String(elevenLabsApiKey),
        },
      });
      if (!resp.ok) {
        const maybeText = await resp.text();
        throw new Error(`Failed to load voices (${resp.status}): ${maybeText}`);
      }
      const data = (await resp.json()) as { voices?: VoiceSummary[] };
      const loaded = Array.isArray(data?.voices) ? data.voices : [];
      setVoices(loaded);
      if (loaded.length > 0 && !selectedVoiceId) {
        setSelectedVoiceId(loaded[0].voice_id);
      }
      // Log after successful load
      console.log('Voices loaded');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Unknown error loading voices');
    } finally {
      setIsLoadingVoices(false);
    }
  }, [elevenLabsApiKey, selectedVoiceId, setSelectedVoiceId]);

  const handleLoadModelsAsync = React.useCallback(async (): Promise<void> => {
    setErrorMessage(null);
    if (!elevenLabsApiKey || String(elevenLabsApiKey).length === 0) {
      setErrorMessage('Please enter your ElevenLabs API key.');
      return;
    }
    setIsLoadingModels(true);
    try {
      const resp = await fetch('https://api.elevenlabs.io/v1/models', {
        method: 'GET',
        headers: {
          'xi-api-key': String(elevenLabsApiKey),
        },
      });
      if (!resp.ok) {
        const maybeText = await resp.text();
        throw new Error(`Failed to load models (${resp.status}): ${maybeText}`);
      }
      const json = (await resp.json()) as unknown;
      let loaded: ModelSummary[] = [];
      if (Array.isArray(json)) {
        loaded = json as ModelSummary[];
      } else if (json !== null && typeof json === 'object' && Array.isArray((json as { models?: unknown }).models)) {
        loaded = (json as { models: ModelSummary[] }).models;
      }
      setModels(loaded);
      if (loaded.length > 0) {
        const preferred = loaded.find((m) => m.model_id === 'eleven_multilingual_v2');
        const nextModelId = preferred?.model_id ?? loaded[0].model_id;
        if (!modelId) {
          setModelId(nextModelId);
        }
      }
      // Log after successful load
      console.log('Models loaded');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Unknown error loading models');
    } finally {
      setIsLoadingModels(false);
    }
  }, [elevenLabsApiKey, modelId, setModelId]);

  // Auto-load lists when API key is present on first render
  React.useEffect(() => {
    if (!!elevenLabsApiKey && voices.length === 0 && !isLoadingVoices) {
      void handleLoadVoicesAsync();
    }
  }, [elevenLabsApiKey, voices.length, isLoadingVoices, handleLoadVoicesAsync]);

  React.useEffect(() => {
    if (!!elevenLabsApiKey && models.length === 0 && !isLoadingModels) {
      void handleLoadModelsAsync();
    }
  }, [elevenLabsApiKey, models.length, isLoadingModels, handleLoadModelsAsync]);

  const pickAcceptMimeFromOutput = (fmt: string | null | undefined): string => {
    const value = String(fmt ?? 'mp3_44100_128');
    if (value.startsWith('mp3_')) {
      return 'audio/mpeg';
    }
    if (value.startsWith('wav_')) {
      return 'audio/wav';
    }
    return 'application/octet-stream';
  };

  const handleSynthesizeAsync = React.useCallback(async (): Promise<void> => {
    setErrorMessage(null);
    if (!elevenLabsApiKey || String(elevenLabsApiKey).length === 0) {
      setErrorMessage('Please enter your ElevenLabs API key.');
      return;
    }
    if (!text || text.trim().length === 0) {
      setErrorMessage('Please enter some text to synthesize.');
      return;
    }
    if (!selectedVoiceId) {
      setErrorMessage('Please select a voice.');
      return;
    }

    setIsSynthesizing(true);
    try {
      const accept = pickAcceptMimeFromOutput(outputFormat);
      const resp = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(String(selectedVoiceId))}`,
        {
          method: 'POST',
          headers: {
            'xi-api-key': String(elevenLabsApiKey),
            'Content-Type': 'application/json',
            Accept: accept,
          },
          body: JSON.stringify({
            model_id: modelId,
            text,
            voice_settings: {
              stability,
              similarity_boost: similarityBoost,
              style,
              use_speaker_boost: isSpeakerBoost,
            },
            output_format: outputFormat,
          }),
        },
      );
      if (!resp.ok) {
        const maybeText = await resp.text();
        throw new Error(`Synthesis failed (${resp.status}): ${maybeText}`);
      }
      const blob = await resp.blob();
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setAlignmentWords(null);
      setAlignmentError(null);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Unknown error during synthesis');
    } finally {
      setIsSynthesizing(false);
    }
  }, [
    elevenLabsApiKey,
    text,
    selectedVoiceId,
    modelId,
    stability,
    similarityBoost,
    style,
    isSpeakerBoost,
    outputFormat,
    audioUrl,
  ]);

  const extractWordsFromAlignment = React.useCallback((json: unknown): TimingWord[] => {
    const results: TimingWord[] = [];
    const j: Record<string, unknown> = (json as Record<string, unknown>) ?? {};
    let wordEntries: unknown[] = [];
    if (Array.isArray((j as { words?: unknown[] }).words)) {
      wordEntries = (j as { words: unknown[] }).words;
    } else if (Array.isArray((j as { alignment?: unknown[] }).alignment)) {
      wordEntries = (j as { alignment: unknown[] }).alignment;
    } else if (Array.isArray((j as { segments?: unknown[] }).segments)) {
      const segs = (j as { segments: unknown[] }).segments as Array<Record<string, unknown>>;
      segs.forEach((s) => {
        const sw = s.words as unknown;
        if (Array.isArray(sw)) {
          wordEntries.push(...(sw as unknown[]));
        }
      });
    }
    for (const w of wordEntries as Array<Record<string, unknown>>) {
      const textVal = String((w.text as string) ?? (w.word as string) ?? '');
      const startVal = Number((w.start as number) ?? (w.start_time as number) ?? (w.startSec as number) ?? 0);
      const endVal = Number((w.end as number) ?? (w.end_time as number) ?? (w.endSec as number) ?? startVal);
      if (textVal) {
        results.push({ text: textVal, start: startVal, end: endVal });
      }
    }
    return results;
  }, []);

  const handleAlignAsync = React.useCallback(async (): Promise<void> => {
    setAlignmentError(null);
    if (!elevenLabsApiKey || String(elevenLabsApiKey).length === 0) {
      setAlignmentError('Please enter your ElevenLabs API key.');
      return;
    }
    if (!audioUrl) {
      setAlignmentError('No audio available to align.');
      return;
    }
    if (!text || text.trim().length === 0) {
      setAlignmentError('Transcript text is required for alignment.');
      return;
    }
    setIsAligning(true);
    try {
      const audioResp = await fetch(audioUrl);
      if (!audioResp.ok) {
        throw new Error(`Failed to read audio blob (${audioResp.status})`);
      }
      const audioBlob = await audioResp.blob();
      const form = new FormData();
      form.append('file', new File([audioBlob], 'tts-output.mp3', { type: audioBlob.type || 'audio/mpeg' }));
      form.append('text', String(text));
      const resp = await fetch('https://api.elevenlabs.io/v1/forced-alignment', {
        method: 'POST',
        headers: {
          'xi-api-key': String(elevenLabsApiKey),
          Accept: 'application/json',
        },
        body: form,
      });
      if (!resp.ok) {
        const maybeText = await resp.text();
        throw new Error(`Alignment failed (${resp.status}): ${maybeText}`);
      }
      const json = (await resp.json()) as unknown;
      const words = extractWordsFromAlignment(json);
      setAlignmentWords(words);
    } catch (err) {
      setAlignmentError(err instanceof Error ? err.message : 'Unknown error during alignment');
    } finally {
      setIsAligning(false);
    }
  }, [elevenLabsApiKey, audioUrl, text, extractWordsFromAlignment]);

  return (
    <Accordion.Item eventKey={eventKey}>
      <Accordion.Header>Voice (TTS) — ElevenLabs</Accordion.Header>
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
                <Form.Group controlId="elevenLabsApiKey">
                  <Form.Label>ElevenLabs API Key</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={isApiKeyVisible ? 'text' : 'password'}
                      placeholder="Enter your ElevenLabs API key..."
                      value={String(elevenLabsApiKey ?? '')}
                      onChange={(e) => setElevenLabsApiKey(e.target.value)}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setIsApiKeyVisible((v) => !v)}
                      aria-label={isApiKeyVisible ? 'Hide API key' : 'Show API key'}
                    >
                      {isApiKeyVisible ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="ttsText">
                  <Form.Label>Text</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Enter narration text..."
                    value={String(text ?? '')}
                    onChange={(e) => setText(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Row className="g-2">
                  <Col md={6}>
                    <Form.Group controlId="ttsVoice">
                      <Form.Label>Voice</Form.Label>
                      <Form.Select
                        value={String(selectedVoiceId ?? '')}
                        onChange={(e) => setSelectedVoiceId(e.target.value)}
                        disabled={voices.length === 0}
                      >
                        {voices.length === 0 && <option value="">No voices loaded</option>}
                        {voices.map((v) => (
                          <option key={v.voice_id} value={v.voice_id}>
                            {v.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="ttsStability">
                      <Form.Label>Stability ({Number(stability ?? 0.5).toFixed(2)})</Form.Label>
                      <Form.Range
                        min={0}
                        max={1}
                        step={0.01}
                        value={Number(stability ?? 0.5)}
                        onChange={(e) => setStability(Number(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="ttsSimilarity">
                      <Form.Label>Similarity Boost ({Number(similarityBoost ?? 0.75).toFixed(2)})</Form.Label>
                      <Form.Range
                        min={0}
                        max={1}
                        step={0.01}
                        value={Number(similarityBoost ?? 0.75)}
                        onChange={(e) => setSimilarityBoost(Number(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="ttsStyle">
                      <Form.Label>Style ({Number(style ?? 0.1).toFixed(2)})</Form.Label>
                      <Form.Range
                        min={0}
                        max={1}
                        step={0.01}
                        value={Number(style ?? 0.1)}
                        onChange={(e) => setStyle(Number(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="ttsModel">
                      <Form.Label>Model</Form.Label>
                      <Form.Select
                        value={String(modelId ?? '')}
                        onChange={(e) => setModelId(e.target.value)}
                        disabled={models.length === 0}
                      >
                        {models.length === 0 && <option value="">No models loaded</option>}
                        {models.map((m) => (
                          <option key={m.model_id} value={m.model_id}>
                            {m.name ?? m.model_id}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="ttsOutputFormat">
                      <Form.Label>Output Format</Form.Label>
                      <Form.Select value={String(outputFormat ?? '')} onChange={(e) => setOutputFormat(e.target.value)}>
                        <option value="mp3_44100_128">mp3_44100_128</option>
                        <option value="mp3_44100_64">mp3_44100_64</option>
                        <option value="wav_44100">wav_44100</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group controlId="ttsSpeakerBoost">
                      <Form.Check
                        type="switch"
                        label="Use Speaker Boost"
                        checked={Boolean((isSpeakerBoost ?? true) as boolean)}
                        onChange={(e) => setIsSpeakerBoost(e.currentTarget.checked)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>
            <div className="mt-3 d-flex gap-2">
              <Button variant="primary" onClick={handleSynthesizeAsync} disabled={isSynthesizing}>
                {isSynthesizing ? 'Synthesizing…' : 'Synthesize'}
              </Button>
              <Button variant="outline-secondary">Save to Library</Button>
            </div>
            {audioUrl && (
              <div className="mt-3">
                <audio controls src={audioUrl} />
                <div>
                  <a href={audioUrl} download="tts-output">
                    Download audio
                  </a>
                </div>
                <div className="mt-2 d-flex gap-2">
                  <Button variant="secondary" onClick={handleAlignAsync} disabled={isAligning}>
                    {isAligning ? 'Aligning…' : 'Get Timings'}
                  </Button>
                </div>
                {alignmentError && (
                  <Alert variant="danger" className="mt-2">
                    {alignmentError}
                  </Alert>
                )}
                {alignmentWords && alignmentWords.length > 0 && (
                  <div className="mt-3">
                    <h6>Word Timings</h6>
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Word</th>
                          <th>Start (s)</th>
                          <th>End (s)</th>
                          <th>Dur (s)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {alignmentWords.map((w, i) => (
                          <tr key={`${w.text}-${i}`}>
                            <td>{i + 1}</td>
                            <td>{w.text}</td>
                            <td>{w.start.toFixed(3)}</td>
                            <td>{w.end.toFixed(3)}</td>
                            <td>{(w.end - w.start).toFixed(3)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </div>
            )}
          </Card.Body>
        </Card>
      </Accordion.Body>
    </Accordion.Item>
  );
};
