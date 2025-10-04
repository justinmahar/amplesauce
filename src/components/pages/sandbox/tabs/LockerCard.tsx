import React from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import {
  deriveSessionKeyAsync,
  exportKeyRawBase64Async,
  encryptWithKeyAsync,
  decryptWithKeyAsync,
} from '../../../utils/cryptoUtil';

export type LockerCardProps = { workspaceUid?: string };

export const LockerCard = ({ workspaceUid }: LockerCardProps): React.JSX.Element => {
  const [password, setPassword] = React.useState<string>('');
  const [sessionKey, setSessionKey] = React.useState<CryptoKey | null>(null);
  const [sessionKeyB64, setSessionKeyB64] = React.useState<string>('');
  const [ciphertext, setCiphertext] = React.useState<string>('');
  const [ivB64, setIvB64] = React.useState<string>('');
  const [decrypted, setDecrypted] = React.useState<string>('');
  const [error, setError] = React.useState<string | null>(null);

  const handleUnlockAsync = async (): Promise<void> => {
    try {
      setError(null);
      if (!workspaceUid || !password) {
        return;
      }
      const key = await deriveSessionKeyAsync(password, workspaceUid);
      if (ciphertext && ivB64) {
        try {
          const txt = await decryptWithKeyAsync(key, ciphertext, ivB64);
          setDecrypted(txt);
        } catch {
          setError('Wrong password or corrupted data');
          return;
        }
      } else {
        setDecrypted('');
      }
      setSessionKey(key);
      const b64 = await exportKeyRawBase64Async(key);
      setSessionKeyB64(b64);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unlock error');
    }
  };

  const handleCloseLocker = (): void => {
    setSessionKey(null);
    setSessionKeyB64('');
    setPassword('');
    setDecrypted('');
    setError(null);
  };

  return (
    <Card className="mt-3">
      <Card.Body>
        <h5 className="mb-3">Locker (Dev)</h5>
        <Form>
          {!sessionKey && (
            <Row className="g-2 align-items-end">
              <Col md={6}>
                <Form.Group controlId="lockerPassword">
                  <Form.Label>Locked — Enter Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter master password"
                  />
                </Form.Group>
              </Col>
              <Col md="auto">
                <Button variant="primary" onClick={handleUnlockAsync} disabled={!workspaceUid}>
                  Unlock
                </Button>
              </Col>
            </Row>
          )}

          {sessionKey && (
            <>
              <div className="mb-2">
                <strong>Session Key (base64):</strong>
                <div className="small text-muted" style={{ wordBreak: 'break-all' }}>
                  {sessionKeyB64}
                </div>
              </div>
              <Row className="g-2 align-items-end">
                <Col md={12}>
                  <Form.Group controlId="lockerDecryptedEditable">
                    <Form.Label>Decrypted (editable, auto-encrypts)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={decrypted}
                      onChange={async (e) => {
                        try {
                          setError(null);
                          const newText = e.target.value;
                          setDecrypted(newText);
                          if (sessionKey) {
                            const res = await encryptWithKeyAsync(sessionKey, newText);
                            setCiphertext(res.ciphertextBase64);
                            setIvB64(res.ivBase64);
                          }
                        } catch (err) {
                          setError(err instanceof Error ? err.message : 'Encrypt error');
                        }
                      }}
                      placeholder="Edit to re-encrypt automatically"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className="mt-2 d-flex gap-2">
                <Button
                  variant="secondary"
                  onClick={async () => {
                    try {
                      setError(null);
                      if (!sessionKey || !ciphertext || !ivB64) {
                        return;
                      }
                      const txt = await decryptWithKeyAsync(sessionKey, ciphertext, ivB64);
                      setDecrypted(txt);
                    } catch (e) {
                      const message =
                        e instanceof DOMException && e.name === 'OperationError'
                          ? 'Wrong password or corrupted data'
                          : e instanceof Error
                            ? e.message
                            : 'Decrypt error';
                      setError(message);
                    }
                  }}
                >
                  Refresh Decrypt
                </Button>
                <Button variant="outline-secondary" onClick={handleCloseLocker}>
                  Close Locker
                </Button>
              </div>
            </>
          )}

          <Row className="g-2 mt-3">
            <Col md={6}>
              <Form.Group controlId="lockerCiphertext">
                <Form.Label>Ciphertext (base64)</Form.Label>
                <Form.Control as="textarea" rows={3} value={ciphertext} readOnly />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="lockerIv">
                <Form.Label>IV (base64)</Form.Label>
                <Form.Control value={ivB64} readOnly />
              </Form.Group>
            </Col>
          </Row>
          {error && <div className="text-danger small mt-2">{error}</div>}
        </Form>
      </Card.Body>
    </Card>
  );
};
