import React, { JSX } from 'react';
import { Accordion } from 'react-bootstrap';
import { VoiceTtsAccordionItem } from './media-fetcher/VoiceTtsAccordionItem';
import { MusicAccordionItem } from './media-fetcher/MusicAccordionItem';
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
        <MusicAccordionItem eventKey="1" />
        <StockMediaAccordionItem eventKey="2" />
        <FontsAccordionItem eventKey="3" />
        <ScreenshotsAccordionItem eventKey="4" />
        <ChartsAccordionItem eventKey="5" />
        <EmojisIconsAccordionItem eventKey="6" />
      </Accordion>
    </div>
  );
};
