import React, { JSX } from 'react';

export interface ContentResearchTabProps {}

export const ContentResearchTab = (_props: ContentResearchTabProps): JSX.Element => {
  return (
    <div>
      <h2 className="mb-3">Content Research</h2>
      <p className="text-secondary">Analyze content ideas and trends. (Placeholder)</p>
    </div>
  );
};
