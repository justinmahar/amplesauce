import React from 'react';
import { Accordion, Button, Card, Col, Form, Row, Image } from 'react-bootstrap';
import { EmojiKitName, getEmojiImageUrl, getEmojiCode } from '../../../../utils/emoji';

export type EmojisIconsAccordionItemProps = { eventKey: string };

export const EmojisIconsAccordionItem = ({ eventKey }: EmojisIconsAccordionItemProps): React.JSX.Element => {
  const [query, setQuery] = React.useState('');
  const [kit, setKit] = React.useState<EmojiKitName>(EmojiKitName.notoEmoji);
  const [preview, setPreview] = React.useState<string>('😀');
  const [version, setVersion] = React.useState<string>('');

  const imageUrl = React.useMemo(() => getEmojiImageUrl(kit, preview), [kit, preview]);
  const code = React.useMemo(() => getEmojiCode(preview), [preview]);

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
                <Button variant="primary">Find</Button>
                <Button variant="outline-secondary">Add Selected</Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Accordion.Body>
    </Accordion.Item>
  );
};
