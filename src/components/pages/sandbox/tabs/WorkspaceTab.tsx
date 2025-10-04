import React, { JSX } from 'react';
import { Button, Card, Col, Form, Row, Table, Spinner, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useElevenLabsApiKey } from '../../../../hooks/useElevenLabsApiKey';
import { usePexelsApiKey } from '../../../../hooks/usePexelsApiKey';
import { useThumbsIoApiKey } from '../../../../hooks/useThumbsIoApiKey';
import { InputGroup } from 'react-bootstrap';
import { useUserSettingsContext } from '../../../contexts/UserSettingsProvider';
import { useWorkspaceContext } from '../../../contexts/WorkspaceProvider';
import { useSiteSettings } from '../../../../settings/useSiteSettings';
import { useUserAccountContext } from '../../../contexts/UserAccountProvider';
import { DocDataAccessor } from '../../../firebase/firestore/models/DocDataAccessor';
import { WorkspaceChannel, WorkspaceChannelFields } from '../../../firebase/firestore/models/WorkspaceChannel';
import { LockerCard } from './LockerCard';

export type WorkspaceTabProps = Record<string, never>;

export const WorkspaceTab = (_props: WorkspaceTabProps): JSX.Element => {
  const siteSettings = useSiteSettings();
  const userSettings = useUserSettingsContext();
  const account = useUserAccountContext();
  const { workspaceLoader, channelsLoader } = useWorkspaceContext();

  const currentWorkspaceUid = userSettings.userSettings?.getCurrentWorkspaceUid();
  const hasWorkspace = (userSettings.userSettings?.getWorkspaces() ?? []).length > 0;

  const [workspaceName, setWorkspaceName] = React.useState<string>('');
  const [savingName, setSavingName] = React.useState<boolean>(false);
  const [newChannelName, setNewChannelName] = React.useState<string>('');
  const [newChannelUrl, setNewChannelUrl] = React.useState<string>('');
  const [addingChannel, setAddingChannel] = React.useState<boolean>(false);
  const [creatingWorkspace, setCreatingWorkspace] = React.useState<boolean>(false);
  const [editingChannelId, setEditingChannelId] = React.useState<string>('');
  const [removingChannelId, setRemovingChannelId] = React.useState<string>('');
  const [showConfirmDelete, setShowConfirmDelete] = React.useState<boolean>(false);
  const [confirmDeleteChannelId, setConfirmDeleteChannelId] = React.useState<string>('');
  const [elevenKey, setElevenKey] = useElevenLabsApiKey();
  const [pexelsKey, setPexelsKey] = usePexelsApiKey();
  const [thumbsKey, setThumbsKey] = useThumbsIoApiKey();
  const [showApiKey, setShowApiKey] = React.useState<{ eleven: boolean; pexels: boolean; thumbs: boolean }>({
    eleven: false,
    pexels: false,
    thumbs: false,
  });
  // Locker moved to LockerCard

  React.useEffect(() => {
    if (workspaceLoader.model) {
      setWorkspaceName(workspaceLoader.model.getName());
    }
  }, [workspaceLoader.model]);

  const handleCreateWorkspaceAsync = async (): Promise<void> => {
    if (!account.user?.uid) {
      return;
    }
    const endpoint = siteSettings.data.settingsYaml.createWorkspaceEndpoint;
    setCreatingWorkspace(true);
    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: account.user.uid }),
      });
    } finally {
      setCreatingWorkspace(false);
    }
  };

  const handleSaveWorkspaceNameAsync = async (): Promise<void> => {
    if (!workspaceLoader.model) {
      return;
    }
    setSavingName(true);
    try {
      await workspaceLoader.model.setName(workspaceName.trim());
    } finally {
      setSavingName(false);
    }
  };

  const handleAddOrSaveChannelAsync = async (): Promise<void> => {
    if (!currentWorkspaceUid) {
      return;
    }
    const name = newChannelName.trim();
    const url = newChannelUrl.trim();
    if (!name) {
      return;
    }
    setAddingChannel(true);
    try {
      if (editingChannelId) {
        const channel = (channelsLoader.models ?? []).find((c) => c.getDocPath().endsWith(`/${editingChannelId}`));
        if (channel) {
          await channel.update({
            [WorkspaceChannelFields.name]: name,
            [WorkspaceChannelFields.channelUrl]: url || undefined,
          });
        }
        setEditingChannelId('');
      } else {
        await DocDataAccessor.addDoc(
          {
            [WorkspaceChannelFields.name]: name,
            [WorkspaceChannelFields.channelUrl]: url || undefined,
          },
          WorkspaceChannel.getWorkspaceChannelCollectionPath(currentWorkspaceUid),
        );
      }
      setNewChannelName('');
      setNewChannelUrl('');
    } finally {
      setAddingChannel(false);
    }
  };

  const handleEditChannel = (channel: WorkspaceChannel): void => {
    setEditingChannelId(channel.getDocPath().split('/').pop() ?? '');
    setNewChannelName(channel.getName?.() ?? '');
    setNewChannelUrl(channel.getChannelUrl?.() ?? '');
  };

  const handleCancelEditChannel = (): void => {
    setEditingChannelId('');
    setNewChannelName('');
    setNewChannelUrl('');
  };

  const handleDeleteChannelClicked = (channel: WorkspaceChannel): void => {
    setConfirmDeleteChannelId(channel.getDocPath().split('/').pop() ?? '');
    setShowConfirmDelete(true);
  };

  const handleConfirmDeleteChannel = async (): Promise<void> => {
    if (!currentWorkspaceUid || !confirmDeleteChannelId) {
      setShowConfirmDelete(false);
      return;
    }
    setRemovingChannelId(confirmDeleteChannelId);
    try {
      await DocDataAccessor.deleteDoc(
        confirmDeleteChannelId,
        WorkspaceChannel.getWorkspaceChannelCollectionPath(currentWorkspaceUid),
      );
    } finally {
      setRemovingChannelId('');
      setShowConfirmDelete(false);
      setConfirmDeleteChannelId('');
    }
  };

  const friendlyLink = (url: string): string => {
    try {
      const u = new URL(url);
      return u.hostname.replace(/^www\./, '');
    } catch {
      return 'Open';
    }
  };

  return (
    <div>
      <h3 className="mb-3">Workspace</h3>
      {!hasWorkspace && (
        <Card className="mb-3">
          <Card.Body className="d-flex justify-content-between align-items-center">
            <div>No workspace found. Create one to get started.</div>
            <Button
              variant="primary"
              onClick={handleCreateWorkspaceAsync}
              disabled={!account.user?.uid || creatingWorkspace}
            >
              {creatingWorkspace ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                  Creating…
                </>
              ) : (
                'Create Workspace'
              )}
            </Button>
          </Card.Body>
        </Card>
      )}
      {hasWorkspace && (
        <>
          <Card className="mb-3">
            <Card.Body>
              <div className="mb-2">
                <strong>Current Workspace UID:</strong> {currentWorkspaceUid ?? 'None'}
              </div>
              <Form className="mb-0">
                <Row className="g-2 align-items-end">
                  <Col md={8}>
                    <Form.Group controlId="workspaceName">
                      <Form.Label>Workspace Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={workspaceName}
                        onChange={(e) => setWorkspaceName(e.target.value)}
                        placeholder="Enter workspace name"
                      />
                    </Form.Group>
                  </Col>
                  <Col md="auto">
                    <Button variant="primary" onClick={handleSaveWorkspaceNameAsync} disabled={savingName}>
                      {savingName ? 'Saving…' : 'Save'}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <h5 className="mb-3">Channels</h5>
              <Form className="mb-3">
                <Row className="g-2 align-items-end">
                  <Col md={4}>
                    <Form.Group controlId="channelName">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={newChannelName}
                        onChange={(e) => setNewChannelName(e.target.value)}
                        placeholder="Channel name"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="channelUrl">
                      <Form.Label>Channel URL</Form.Label>
                      <Form.Control
                        type="url"
                        value={newChannelUrl}
                        onChange={(e) => setNewChannelUrl(e.target.value)}
                        placeholder="https://youtube.com/@handle or similar"
                      />
                    </Form.Group>
                  </Col>
                  <Col md="auto">
                    <Button variant="success" onClick={handleAddOrSaveChannelAsync} disabled={addingChannel}>
                      {addingChannel
                        ? editingChannelId
                          ? 'Saving…'
                          : 'Adding…'
                        : editingChannelId
                          ? 'Save'
                          : 'Add Channel'}
                    </Button>
                    {editingChannelId && (
                      <Button variant="outline-secondary" className="ms-2" onClick={handleCancelEditChannel}>
                        Cancel
                      </Button>
                    )}
                  </Col>
                </Row>
              </Form>
              <Table striped bordered hover size="sm" className="mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>URL</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(channelsLoader.models ?? []).map((c) => (
                    <tr key={c.getDocPath()}>
                      <td>{c.getName?.() ?? '(unnamed)'}</td>
                      <td>
                        {c.getChannelUrl?.() ? (
                          <a href={c.getChannelUrl()} target="_blank" rel="noreferrer">
                            {friendlyLink(c.getChannelUrl()!)}
                          </a>
                        ) : (
                          ''
                        )}
                      </td>
                      <td className="text-nowrap">
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          className="me-2"
                          aria-label="Edit channel"
                          onClick={() => handleEditChannel(c)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          aria-label="Remove channel"
                          onClick={() => handleDeleteChannelClicked(c)}
                          disabled={removingChannelId === c.getDocPath().split('/').pop()}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
          <Card className="mt-3">
            <Card.Body>
              <h5 className="mb-3">API Keys</h5>
              <Row className="g-3">
                <Col md={12}>
                  <Form.Group controlId="apiElevenLabs">
                    <Form.Label>ElevenLabs</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showApiKey.eleven ? 'text' : 'password'}
                        placeholder="Enter ElevenLabs API key"
                        value={String(elevenKey ?? '')}
                        onChange={(e) => setElevenKey(e.target.value)}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowApiKey((s) => ({ ...s, eleven: !s.eleven }))}
                        aria-label={showApiKey.eleven ? 'Hide key' : 'Show key'}
                      >
                        {showApiKey.eleven ? 'Hide' : 'Show'}
                      </Button>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group controlId="apiPexels">
                    <Form.Label>Pexels</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showApiKey.pexels ? 'text' : 'password'}
                        placeholder="Enter Pexels API key"
                        value={String(pexelsKey ?? '')}
                        onChange={(e) => setPexelsKey(e.target.value)}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowApiKey((s) => ({ ...s, pexels: !s.pexels }))}
                        aria-label={showApiKey.pexels ? 'Hide key' : 'Show key'}
                      >
                        {showApiKey.pexels ? 'Hide' : 'Show'}
                      </Button>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group controlId="apiThumbs">
                    <Form.Label>Thumbs.io</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showApiKey.thumbs ? 'text' : 'password'}
                        placeholder="Enter Thumbs.io API key"
                        value={String(thumbsKey ?? '')}
                        onChange={(e) => setThumbsKey(e.target.value)}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowApiKey((s) => ({ ...s, thumbs: !s.thumbs }))}
                        aria-label={showApiKey.thumbs ? 'Hide key' : 'Show key'}
                      >
                        {showApiKey.thumbs ? 'Hide' : 'Show'}
                      </Button>
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Modal show={showConfirmDelete} onHide={() => setShowConfirmDelete(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Remove Channel?</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to remove this channel?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowConfirmDelete(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleConfirmDeleteChannel} disabled={!!removingChannelId}>
                Remove
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </div>
  );
};
