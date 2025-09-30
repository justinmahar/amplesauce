import React from 'react';
import DefaultMarkdownPage from './DefaultMarkdownPage';
import { TemplateTagRenderer } from '../template-tags/TemplateTagRenderer';
import MarkdownContent from './MarkdownContent';

interface Props {
  markdownContent: MarkdownContent;
  templateTagRenderer: TemplateTagRenderer;
}

export const MarkdownPage = ({ markdownContent, templateTagRenderer }: Props) => {
  return <DefaultMarkdownPage markdownContent={markdownContent} templateTagRenderer={templateTagRenderer} />;
};
