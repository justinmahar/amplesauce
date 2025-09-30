import React, { JSX } from 'react';
import { Button } from 'react-bootstrap';

export interface NicheHunterTabProps {}

export const NicheHunterTab = (_props: NicheHunterTabProps): JSX.Element => {
  return (
    <div>
      <h2 className="mb-3">Niche Hunter</h2>
      <p className="text-secondary">Explore niches and assess opportunities. (Placeholder)</p>
      <Button variant="primary">Get Started</Button>
    </div>
  );
};
