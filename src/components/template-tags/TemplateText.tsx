import React, { JSX } from 'react';
import MarkdownContent from '../markdown/MarkdownContent';
import SiteSettings, { useSiteSettings } from '../../settings/useSiteSettings';
import { TemplateTagRenderer } from './TemplateTagRenderer';

export interface TemplateTextProps {
  text: string;
  markdownContent?: MarkdownContent;
}

export const TemplateText = (props: TemplateTextProps): JSX.Element => {
  const settings: SiteSettings = useSiteSettings();
  let tags: TemplateTagRenderer = settings.getTemplateTagRenderer();
  if (props.markdownContent) {
    tags = tags.combineWith(props.markdownContent.getTemplateTagRenderer());
  }
  const renderedText = tags.render(props.text);
  return <>{renderedText}</>;
};
