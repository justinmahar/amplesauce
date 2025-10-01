import React from 'react';
import { Accordion, Button, Card, Col, Form, Row, Image } from 'react-bootstrap';
import { EmojiKitName, getEmojiImageUrl } from '../../../../utils/emoji';
import { useThemeContext } from '../../../../contexts/ThemeProvider';

export type EmojisIconsAccordionItemProps = { eventKey: string };

export const EmojisIconsAccordionItem = ({ eventKey }: EmojisIconsAccordionItemProps): React.JSX.Element => {
  const themeContext = useThemeContext();
  const [query, setQuery] = React.useState('');
  const [kit, setKit] = React.useState<EmojiKitName>(EmojiKitName.notoEmoji);
  const [preview, setPreview] = React.useState<string>('😀');
  const [version, setVersion] = React.useState<string>('');
  const [results, setResults] = React.useState<{ key: string; emoji: string }[]>([]);

  // Lazy load node-emoji to avoid SSR issues
  const [emojiLib, setEmojiLib] = React.useState<{ search: (q: string) => { key: string; emoji: string }[] } | null>(
    null,
  );
  React.useEffect(() => {
    let mounted = true;
    import('node-emoji')
      .then((mod) => {
        if (mounted) {
          setEmojiLib(mod as unknown as { search: (q: string) => { key: string; emoji: string }[] });
        }
      })
      .catch(() => {
        if (mounted) {
          setEmojiLib(null);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  const imageUrl = React.useMemo(() => getEmojiImageUrl(kit, preview), [kit, preview]);

  // Auto-search and Enter-select-first
  React.useEffect(() => {
    if (!emojiLib) {
      return;
    }
    const q = (query ?? '').trim();
    const handle = window.setTimeout(() => {
      if (!q) {
        setResults([]);
        return;
      }
      try {
        const found = (emojiLib.search(q) || [])
          .map((r: { key: string; emoji: string }) => ({ key: r.key, emoji: r.emoji }))
          .slice(0, 60);
        setResults(found);
      } catch (e) {
        setResults([]);
      }
    }, 250);
    return () => window.clearTimeout(handle);
  }, [emojiLib, query]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && results.length > 0) {
      e.preventDefault();
      setPreview(results[0].emoji);
    }
  };

  return (
    <Accordion.Item eventKey={eventKey}>
      <Accordion.Header>Emojis / Icons</Accordion.Header>
      <Accordion.Body>
        <Card className="mb-3">
          <Card.Body>
            <Row className="g-2 align-items-end">
              <Col md={8}>
                <Form.Group controlId="emojiQuery">
                  <Form.Label>Search</Form.Label>
                  <Form.Control
                    placeholder="e.g., rocket, chart, smile"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="emojiStyle">
                  <Form.Label>Style</Form.Label>
                  <Form.Select value={kit} onChange={(e) => setKit(e.target.value as EmojiKitName)}>
                    <option value={EmojiKitName.twemoji}>Twemoji (72)</option>
                    <option value={EmojiKitName.joyPixels}>JoyPixels (64)</option>
                    <option value={EmojiKitName.openMojiColor}>OpenMoji Color (618)</option>
                    <option value={EmojiKitName.openMojiBlack}>OpenMoji Black (618)</option>
                    <option value={EmojiKitName.notoEmoji}>NotoEmoji (512)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            {!!results.length && (
              <div className="mt-2">
                <div className="text-muted small mb-1">Results</div>
                <div className="d-flex flex-wrap gap-2">
                  {results.map((r) => (
                    <Button
                      key={`emoji-result-${r.key}`}
                      variant={themeContext.darkModeEnabled ? 'outline-dark' : 'outline-light'}
                      size="sm"
                      onClick={() => {
                        setPreview(r.emoji);
                      }}
                    >
                      <span style={{ fontSize: 18, lineHeight: 1 }}>{r.emoji}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <Row className="g-2 mt-1 align-items-end">
              <Col md={4}>
                <Form.Group controlId="emojiPreviewText">
                  <Form.Label>Preview Emoji</Form.Label>
                  <Form.Control
                    value={preview}
                    onChange={(e) => setPreview(e.target.value)}
                    placeholder="Type an emoji"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="emojiVersion">
                  <Form.Label>Version (optional)</Form.Label>
                  <Form.Control value={version} onChange={(e) => setVersion(e.target.value)} placeholder="auto" />
                </Form.Group>
              </Col>
            </Row>
            <div className="mt-3 d-flex align-items-center gap-3">
              <div>
                <div className="text-muted small">Preview</div>
                <Image src={imageUrl} alt="emoji preview" width={256} height={256} />
              </div>
              <div className="flex-grow-1" />
              <div className="d-flex gap-2">
                <Button variant="outline-secondary">Add Selected</Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Accordion.Body>
    </Accordion.Item>
  );
};
