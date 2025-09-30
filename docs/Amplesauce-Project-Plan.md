## Amplesauce Project Plan

### Executive Summary
Amplesauce automates creation of high-quality YouTube videos by combining human-recorded “bookends” (intro/outro clips) with AI-generated informational content. The system produces research-backed scripts, scene plans, voiceovers, stock media selections, and packaging (thumbnail/title/description), with the option to push titles, descriptions, and thumbnails via the YouTube Data API. Initial focus is on fully automated informational videos; tutorials and complex demos can follow.

### Goals & Non-Goals (v1)
- **Goals**:
  - Automate informational video production end-to-end using a structured scene JSON schema
  - Allow manual override at each step and a pure manual build path
  - Support “bookends” (human clips) with transcript and word-time metadata
  - Fetch and manage media (voiceovers, stock images/video, fonts)
  - Generate thumbnails, titles, descriptions, and chapters
  - Publish metadata to YouTube when an API key is available
- **Non-Goals**:
  - Full tutorial automation (complex multi-step software demos)
  - Advanced multi-track editing beyond the defined schema
  - Rights management automation for paid stock libraries beyond configured keys

### User Roles & Permissions (initial)
- **Admin**: Manage workspaces, channels, API keys, templates, and all assets
- **Editor**: Create/edit videos, manage assets within assigned workspaces
- **Viewer**: Read-only access to assets and outputs (future, optional)

### System Overview
- **Frontend**: React/Gatsby app for management UI and flows
- **Backend**: Firebase (Cloud Functions) for AI flows, processing, and integrations
- **Data**: Firestore for entities (workspaces, channels, assets, videos), Cloud Storage for media
- **Rendering**: Remotion-based pipeline (cloud render), downloadable output
- **AI**: Prompt-driven flows for research, scene planning, and packaging (structured JSON)
- **Integrations**: YouTube Data API, ElevenLabs TTS, Pexels/Unsplash stock media, Google Fonts

### Core Modules
#### Workspace Manager
- Users with roles; workspace-scoped settings; API keys per workspace or per channel

#### Asset Manager (Bookends)
- Upload/manage bookend clips; store transcript and word-time metadata for alignment
- Asset library for custom icons/images/screenshots/recordings

#### Channel & Series Manager
- Channel details (ID, name, cover, description, profile, API key override)
- Flow prompts per channel/series; thumbnail template library
- Description templates (mustache), affiliate program/link library and product catalog for AI auto-selection

#### Keyword Research
- Topics and keyword collections (semantic uniqueness, dedupe)
- Volume/trend estimates (provider TBD), quick open YouTube results
- Import/paste custom keyword lists with uniqueness checks

#### Video Production Tool
- **Research**: Collects sources with citations; ingests user uploads; strips audio and performs transcription (STT) for analysis; sets source content list
- **Media Manager**: Manage uploads and library assets
- **Scene JSON Builder**: Structured schema for script and media refs (animated titles/lower thirds, text overlays, animated backgrounds, icon/image popups, dynamic charts/graphs, transitions); supports user input requests with fallbacks; reroll/edit
- **Scene Preview**: Lightweight preview of narration, timing, and media placements
- **Media Fetcher**: Voiceovers, stock media, fonts, emojis, screenshots, charts
- **Cloud Rendering & Download**: Produce final video; store in bucket; download link
- **Video Packager**: Thumbnail text, template application, left/right text-hero layouts, shuffle variants; hero fallback order: per-video hero → template library → emoji; generate title/description/chapters; add affiliate text
- **Details & YT Push**: Select thumbnail/title/description and push to YouTube if authorized (titles/descriptions/thumbnails)

#### Manual Build Mode
- Skip research; user supplies source content and/or media; use same scene/schema tooling

### Media & Integrations
- **Voice (TTS)**: ElevenLabs
- **Transcription (STT)**: Strip audio from uploads and transcribe for research (provider TBD; e.g., Whisper/AssemblyAI/Deepgram)
- **Stock Media**: Pexels, Unsplash (optional paid providers via API keys)
- **Fonts**: Google Fonts
- **Screenshots**: Headless browser/API (provider TBD)
- **Charts**: ChartJS (optional, rendered to frames or overlays)
- **YouTube Data API**: Set title/description/thumbnail (quota example: `videos.update` ≈ 50 units, `thumbnails.set` ≈ 50 units)

### AI Strategy
- Use “bookends” for human authenticity; AI selects which bookends to use per video
- Prompted flows determine research scope, outline, and scene-level JSON
- Validate against a strict schema; surface diffs and allow rerolls by section
- Deterministic configuration for repeatability; capture runs for auditability

### Data Model (Initial, high level)
- **Workspace**: name, members/roles, settings, providers
- **User**: auth uid, profile, roles per workspace
- **Asset**: type (bookend, image, video, audio, font), metadata (transcript, word times)
- **Channel**: ids, branding, prompts, templates, description settings, affiliate links, API keys
- **Series**: grouping under channel with inherited defaults
- **Topic**: label with keyword collections
- **Keyword**: term, uniqueness hash/group, volume, trend
- **Video**: status, sources, scene JSON, media refs, render outputs, packaging
- **MediaItem**: resolved assets (voiceover clips, stock downloads), provenance
- **ThumbnailTemplate**: layout, colors, font, hero image slot(s)
- **Affiliate**: program/list, links, product catalog, placement templates

### UX Notes
- Provide curated defaults for thumbnail templates and allow shuffle variants
- Support scene elements such as animated titles/lower thirds, text overlays, animated backgrounds, icon/image popups; include transitions between sequences
- Clear diff view in scene builder to compare rerolls vs. current
- Always allow manual overrides and easy re-render of the affected segment

### Roadmap & Milestones (brief timeline, T-shirt sizes)
- **M1: Manual pipeline E2E (M)**
  - Target: Oct 15, 2025
  - Manual scene build; basic render; manual packaging; download only
- **M2: Research + Scene Builder automation (L)**
  - Target: Nov 10, 2025
  - Sources with citations; schema validation; rerolls; preview
- **M3: Media Fetcher + Cloud Render (L)**
  - Target: Dec 05, 2025
  - ElevenLabs TTS; Pexels/Unsplash fetch; fonts; render to bucket
- **M4: Packaging + YouTube API push (M)**
  - Target: Dec 20, 2025
  - Thumbnail generator (templates/shuffle); title/description/chapters; YT push
- **M5: Keyword Research Suite (M)**
  - Target: Jan 15, 2026
  - Topics, collections, dedupe, volume/trends, quick YT results
  
- Later: User assignments (S)

### Risks & Assumptions
- **Quotas & Cost**: YouTube API quotas; TTS and stock media usage costs; render costs
- **Licensing**: Ensure compliance with stock media licenses and attribution where required
- **Quality**: TTS/narration quality; alignment of bookends and AI content
- **Performance**: Render time; media fetch reliability; API rate limits

### Open Questions
- Preferred headless browser/screenshots provider? (e.g., Playwright on Cloud Functions vs managed API)
- Required minimum voice styles/voices in ElevenLabs?
- Any paid stock libraries to include beyond Pexels/Unsplash at launch?
- Budget thresholds that trigger throttling or user confirmation?


