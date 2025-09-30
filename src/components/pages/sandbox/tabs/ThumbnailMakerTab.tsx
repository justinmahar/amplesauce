import React, { JSX } from 'react';

export interface ThumbnailMakerTabProps {}

export const ThumbnailMakerTab = (_props: ThumbnailMakerTabProps): JSX.Element => {
  return (
    <div>
      <h2 className="mb-3">Thumbnail Maker</h2>
      <p className="text-secondary">Design video thumbnails. (Placeholder)</p>
    </div>
  );
};
