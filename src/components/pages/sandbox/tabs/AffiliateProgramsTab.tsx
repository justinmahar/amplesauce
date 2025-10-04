import React, { JSX } from 'react';
import { Button, Card, Col, Form, Row, Table, Alert, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useWorkspaceContext } from '../../../contexts/WorkspaceProvider';
import { useUserSettingsContext } from '../../../contexts/UserSettingsProvider';
import { AffiliateCollection, AffiliateProgram } from '../../../firebase/firestore/models/Workspace';

export type AffiliateProgramsTabProps = Record<string, never>;

export const AffiliateProgramsTab = (_props: AffiliateProgramsTabProps): JSX.Element => {
  const { workspaceLoader } = useWorkspaceContext();
  const userSettings = useUserSettingsContext();

  const workspace = workspaceLoader.model;
  const hasWorkspace = (userSettings.userSettings?.getWorkspaces() ?? []).length > 0;

  const [selectedCollectionId, setSelectedCollectionId] = React.useState<string>('');
  const [newCollectionId, setNewCollectionId] = React.useState<string>('');
  const [newCollectionName, setNewCollectionName] = React.useState<string>('');
  const [collectionIdTouched, setCollectionIdTouched] = React.useState<boolean>(false);
  const [savingCollection, setSavingCollection] = React.useState<boolean>(false);
  const [removingCollectionId, setRemovingCollectionId] = React.useState<string>('');
  const [confirmRemoveId, setConfirmRemoveId] = React.useState<string>('');
  const [showConfirm, setShowConfirm] = React.useState<boolean>(false);

  const [programId, setProgramId] = React.useState<string>('');
  const [programName, setProgramName] = React.useState<string>('');
  const [programIdTouched, setProgramIdTouched] = React.useState<boolean>(false);
  const [affiliateLink, setAffiliateLink] = React.useState<string>('');
  const [productUrl, setProductUrl] = React.useState<string>('');
  const [manageUrl, setManageUrl] = React.useState<string>('');
  const [savingProgram, setSavingProgram] = React.useState<boolean>(false);
  const [removingProgramId, setRemovingProgramId] = React.useState<string>('');
  const [editingProgramId, setEditingProgramId] = React.useState<string>('');

  const collectionsSource = workspace?.getAffiliateCollections();
  const collections: AffiliateCollection[] = React.useMemo(() => collectionsSource ?? [], [collectionsSource]);

  React.useEffect(() => {
    if (collections.length > 0 && !selectedCollectionId) {
      setSelectedCollectionId(collections[0].id);
    }
  }, [collections, selectedCollectionId]);

  const selectedCollection = React.useMemo(
    () => collections.find((c) => c.id === selectedCollectionId),
    [collections, selectedCollectionId],
  );

  const slugify = React.useCallback((s: string): string => {
    return s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }, []);

  const handleAddCollectionAsync = async (): Promise<void> => {
    if (!workspace) {
      return;
    }
    const id = newCollectionId.trim();
    const name = newCollectionName.trim();
    if (!id || !name) {
      return;
    }
    setSavingCollection(true);
    try {
      await workspace.addAffiliateCollection({ id, name, programs: [] });
      setNewCollectionId('');
      setNewCollectionName('');
      setSelectedCollectionId(id);
    } finally {
      setSavingCollection(false);
    }
  };

  const handleRemoveCollectionAsync = async (id: string): Promise<void> => {
    if (!workspace) {
      return;
    }
    setRemovingCollectionId(id);
    try {
      await workspace.removeAffiliateCollection(id);
      if (selectedCollectionId === id) {
        setSelectedCollectionId('');
      }
    } finally {
      setRemovingCollectionId('');
    }
  };

  const handleRemoveCollectionClicked = (id: string): void => {
    const target = collections.find((c) => c.id === id);
    const hasPrograms = (target?.programs?.length ?? 0) > 0;
    if (hasPrograms) {
      setConfirmRemoveId(id);
      setShowConfirm(true);
    } else {
      void handleRemoveCollectionAsync(id);
    }
  };

  const handleConfirmRemove = async (): Promise<void> => {
    if (!confirmRemoveId) {
      setShowConfirm(false);
      return;
    }
    await handleRemoveCollectionAsync(confirmRemoveId);
    setShowConfirm(false);
    setConfirmRemoveId('');
  };

  const handleSaveProgramAsync = async (): Promise<void> => {
    if (!workspace || !selectedCollectionId) {
      return;
    }
    const p: AffiliateProgram = {
      id: programId.trim(),
      name: programName.trim(),
      affiliateLink: affiliateLink.trim() || undefined,
      productUrl: productUrl.trim() || undefined,
      manageUrl: manageUrl.trim() || undefined,
    };
    if (!p.id || !p.name) {
      return;
    }
    setSavingProgram(true);
    try {
      await workspace.setAffiliateProgramInCollection(selectedCollectionId, p);
      setProgramId('');
      setProgramName('');
      setAffiliateLink('');
      setProductUrl('');
      setManageUrl('');
      setEditingProgramId('');
      setProgramIdTouched(false);
    } finally {
      setSavingProgram(false);
    }
  };

  const handleRemoveProgramAsync = async (id: string): Promise<void> => {
    if (!workspace || !selectedCollectionId) {
      return;
    }
    setRemovingProgramId(id);
    try {
      await workspace.removeAffiliateProgramFromCollection(selectedCollectionId, id);
    } finally {
      setRemovingProgramId('');
    }
  };

  const handleEditProgram = (p: AffiliateProgram): void => {
    setProgramId(p.id);
    setProgramName(p.name);
    setAffiliateLink(p.affiliateLink ?? '');
    setProductUrl(p.productUrl ?? '');
    setManageUrl(p.manageUrl ?? '');
    setEditingProgramId(p.id);
    setProgramIdTouched(true);
  };

  const handleCancelEdit = (): void => {
    setEditingProgramId('');
    setProgramId('');
    setProgramName('');
    setAffiliateLink('');
    setProductUrl('');
    setManageUrl('');
    setProgramIdTouched(false);
  };

  if (!hasWorkspace) {
    return (
      <Alert variant="warning" className="mb-0">
        No workspace found. Create a workspace first.
      </Alert>
    );
  }

  return (
    <div>
      <h3 className="mb-3">Affiliate Programs</h3>
      <Card className="mb-3">
        <Card.Body>
          <h5 className="mb-3">Collections</h5>
          <Form className="mb-3">
            <Row className="g-2 align-items-end">
              <Col md={5}>
                <Form.Group controlId="collectionName">
                  <Form.Label>Collection Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newCollectionName}
                    onChange={(e) => {
                      const v = e.target.value;
                      setNewCollectionName(v);
                      if (!collectionIdTouched) {
                        setNewCollectionId(slugify(v));
                      }
                    }}
                    placeholder="My Partners"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="collectionId">
                  <Form.Label>Collection ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={newCollectionId}
                    onChange={(e) => {
                      setCollectionIdTouched(true);
                      setNewCollectionId(e.target.value);
                    }}
                    placeholder="unique-id"
                  />
                </Form.Group>
              </Col>
              <Col md="auto">
                <Button variant="primary" onClick={handleAddCollectionAsync} disabled={savingCollection}>
                  {savingCollection ? 'Saving…' : 'Add Collection'}
                </Button>
              </Col>
            </Row>
          </Form>

          <Row className="g-2 align-items-center">
            <Col md={6}>
              <Form.Select value={selectedCollectionId} onChange={(e) => setSelectedCollectionId(e.target.value)}>
                <option value="">Select a collection…</option>
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.id})
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md="auto">
              {selectedCollection && (
                <Button
                  variant="outline-danger"
                  onClick={() => handleRemoveCollectionClicked(selectedCollection.id)}
                  disabled={removingCollectionId === selectedCollection.id}
                >
                  {removingCollectionId === selectedCollection.id ? 'Removing…' : 'Remove Collection'}
                </Button>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <h5 className="mb-3">Programs</h5>
          {!selectedCollection && <div>Select a collection to manage its programs.</div>}
          {selectedCollection && (
            <>
              <Form className="mb-3">
                <Row className="g-2 align-items-end">
                  <Col md={3}>
                    <Form.Group controlId="programName">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={programName}
                        onChange={(e) => {
                          const v = e.target.value;
                          setProgramName(v);
                          if (!programIdTouched) {
                            setProgramId(slugify(v));
                          }
                        }}
                        placeholder="Partner name"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group controlId="programId">
                      <Form.Label>ID</Form.Label>
                      <Form.Control
                        type="text"
                        value={programId}
                        onChange={(e) => {
                          setProgramIdTouched(true);
                          setProgramId(e.target.value);
                        }}
                        placeholder="id"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group controlId="affiliateLink">
                      <Form.Label>Affiliate Link</Form.Label>
                      <Form.Control
                        type="url"
                        value={affiliateLink}
                        onChange={(e) => setAffiliateLink(e.target.value)}
                        placeholder="https://ref.example.com/..."
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group controlId="productUrl">
                      <Form.Label>Product URL</Form.Label>
                      <Form.Control
                        type="url"
                        value={productUrl}
                        onChange={(e) => setProductUrl(e.target.value)}
                        placeholder="https://..."
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group controlId="manageUrl">
                      <Form.Label>Manage URL</Form.Label>
                      <Form.Control
                        type="url"
                        value={manageUrl}
                        onChange={(e) => setManageUrl(e.target.value)}
                        placeholder="https://..."
                      />
                    </Form.Group>
                  </Col>
                  <Col md="auto">
                    <Button variant="success" onClick={handleSaveProgramAsync} disabled={savingProgram}>
                      {savingProgram ? 'Saving…' : 'Add / Update Program'}
                    </Button>
                    {editingProgramId && (
                      <Button variant="outline-secondary" className="ms-2" onClick={handleCancelEdit}>
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
                    <th>ID</th>
                    <th>Affiliate Link</th>
                    <th>Product URL</th>
                    <th>Manage URL</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedCollection.programs ?? []).map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.id}</td>
                      <td>
                        {p.affiliateLink ? (
                          <a href={p.affiliateLink} target="_blank" rel="noreferrer">
                            {new URL(p.affiliateLink).hostname.replace(/^www\./, '')}
                          </a>
                        ) : (
                          ''
                        )}
                      </td>
                      <td>
                        {p.productUrl ? (
                          <a href={p.productUrl} target="_blank" rel="noreferrer">
                            {new URL(p.productUrl).hostname.replace(/^www\./, '')}
                          </a>
                        ) : (
                          ''
                        )}
                      </td>
                      <td>
                        {p.manageUrl ? (
                          <a href={p.manageUrl} target="_blank" rel="noreferrer">
                            {new URL(p.manageUrl).hostname.replace(/^www\./, '')}
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
                          aria-label="Edit program"
                          onClick={() => handleEditProgram(p)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          aria-label="Remove program"
                          onClick={() => handleRemoveProgramAsync(p.id)}
                          disabled={removingProgramId === p.id}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Card.Body>
      </Card>

      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Remove Collection?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This collection contains one or more affiliate programs. Are you sure you want to remove it? This action
          cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmRemove} disabled={!!removingCollectionId}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
