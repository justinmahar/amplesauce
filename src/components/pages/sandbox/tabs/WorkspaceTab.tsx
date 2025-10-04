import React, { JSX } from 'react';
import { Card } from 'react-bootstrap';

export type WorkspaceTabProps = Record<string, never>;

export const WorkspaceTab = (_props: WorkspaceTabProps): JSX.Element => {
  return (
    <div>
      <h3 className="mb-3">Workspace</h3>
      <Card>
        <Card.Body>
          <p className="mb-0">This is a placeholder for Workspace tools and content.</p>
        </Card.Body>
      </Card>
    </div>
  );
};
