import classNames from 'classnames';
import React, { JSX } from 'react';
import { Col, Container, ListGroup, Row } from 'react-bootstrap';
import Header from '../../layout/Header';
import { useThemeContext } from '../../contexts/ThemeProvider';
import { useQueryParamString } from 'react-use-query-param-string';
import { NicheHunterTab } from './tabs/NicheHunterTab';
import { KeywordResearchTab } from './tabs/KeywordResearchTab';
import { ContentResearchTab } from './tabs/ContentResearchTab';
import { RemotionTab } from './tabs/RemotionTab';
import { MediaFetcherTab } from './tabs/MediaFetcherTab';
import { ThumbnailMakerTab } from './tabs/ThumbnailMakerTab';
import { WorkspaceTab } from './tabs/WorkspaceTab';
import { AffiliateProgramsTab } from './tabs/AffiliateProgramsTab';

// Constants
const TABS = [
  'Workspace',
  'Niche Hunter',
  'Keyword Research',
  'Content Research',
  'Remotion',
  'Media Fetcher',
  'Thumbnail Maker',
  'Affiliate Programs',
] as const;

type TabKey = (typeof TABS)[number];
const DEFAULT_TAB: TabKey = 'Workspace';
const TAB_QUERY_KEY = 'tab';

// Types/Interfaces
export type SandboxPageProps = Record<string, never>;

/**
 * Full-page sandbox with left-side vertical tabs. Includes Header; omits Footer.
 */
export default function SandboxPage(_props: SandboxPageProps): JSX.Element {
  // State
  const theme = useThemeContext();
  const [tabValue, setTabValue, tabInitialized] = useQueryParamString(TAB_QUERY_KEY, DEFAULT_TAB, true);

  // Handlers
  const handleSelectTab = (tab: TabKey) => {
    setTabValue(tab);
  };

  // Effects

  // Consts for rendered elements
  const activeTab: TabKey =
    tabInitialized && (TABS as readonly string[]).includes(tabValue) ? (tabValue as TabKey) : DEFAULT_TAB;

  // Render
  return (
    <>
      <Header />
      <div style={{ paddingTop: 90 }} />
      <Container fluid className={classNames(theme.darkModeEnabled ? 'text-white' : 'text-black')}>
        <Row>
          <Col md={3} lg={2} className="border-end">
            <ListGroup variant="flush">
              {TABS.map((tab) => (
                <ListGroup.Item key={tab} action onClick={() => handleSelectTab(tab)} active={activeTab === tab}>
                  {tab}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col md={9} lg={10} className="p-4">
            {activeTab === 'Niche Hunter' && <NicheHunterTab />}
            {activeTab === 'Keyword Research' && <KeywordResearchTab />}
            {activeTab === 'Content Research' && <ContentResearchTab />}
            {activeTab === 'Remotion' && <RemotionTab />}
            {activeTab === 'Media Fetcher' && <MediaFetcherTab />}
            {activeTab === 'Thumbnail Maker' && <ThumbnailMakerTab />}
            {activeTab === 'Affiliate Programs' && <AffiliateProgramsTab />}
            {activeTab === 'Workspace' && <WorkspaceTab />}
          </Col>
        </Row>
      </Container>
    </>
  );
}
