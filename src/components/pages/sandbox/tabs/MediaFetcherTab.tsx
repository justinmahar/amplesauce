import React, { JSX } from 'react';
import { Accordion } from 'react-bootstrap';
import { VoiceTtsAccordionItem } from './media-fetcher/VoiceTtsAccordionItem';
import { StockMediaAccordionItem } from './media-fetcher/StockMediaAccordionItem';
import { FontsAccordionItem } from './media-fetcher/FontsAccordionItem';
import { ScreenshotsAccordionItem } from './media-fetcher/ScreenshotsAccordionItem';
import { ChartsAccordionItem } from './media-fetcher/ChartsAccordionItem';
import { EmojisIconsAccordionItem } from './media-fetcher/EmojisIconsAccordionItem';

export type MediaFetcherTabProps = Record<string, never>;

export const MediaFetcherTab = (_props: MediaFetcherTabProps): JSX.Element => {
  return (
    <div>
      <h2 className="mb-3">Media Fetcher</h2>
      <Accordion defaultActiveKey="0">
        <VoiceTtsAccordionItem eventKey="0" />
        <StockMediaAccordionItem eventKey="1" />
        <FontsAccordionItem eventKey="2" />
        <ScreenshotsAccordionItem eventKey="3" />
        <ChartsAccordionItem eventKey="4" />
        <EmojisIconsAccordionItem eventKey="5" />
      </Accordion>
    </div>
  );
};
