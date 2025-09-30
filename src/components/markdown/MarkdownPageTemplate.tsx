import { PageProps } from 'gatsby';
import React, { JSX } from 'react';
import SiteSettings, { useSiteSettings } from '../../settings/useSiteSettings';
import MarkdownContent, { MarkdownNode } from './MarkdownContent';
import { MarkdownPage } from './MarkdownPage';
import { TemplateTagRenderer } from '../template-tags/TemplateTagRenderer';

export default function MarkdownPageTemplate(props: PageProps<{ markdownRemark: MarkdownNode }>): JSX.Element {
  const markdownContent: MarkdownContent = new MarkdownContent(props.data.markdownRemark);
  const settings: SiteSettings = useSiteSettings();

  const templateTagRenderer: TemplateTagRenderer = markdownContent
    .getTemplateTagRenderer()
    .combineWith(settings.getTemplateTagRenderer());

  return <MarkdownPage markdownContent={markdownContent} templateTagRenderer={templateTagRenderer} />;
}

// Page query is located in js folder, in file of same name
