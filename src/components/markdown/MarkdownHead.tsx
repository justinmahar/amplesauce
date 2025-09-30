import React, { JSX } from 'react';
import MarkdownContent from './MarkdownContent';
import { TemplateTagRenderer } from '../template-tags/TemplateTagRenderer';
import Head from '../layout/Head';

export interface MarkdownHeadProps {
  markdownContent: MarkdownContent;
  children?: React.ReactNode;
}

export default function MarkdownHead(props: MarkdownHeadProps): JSX.Element {
  const markdownContent: MarkdownContent = props.markdownContent;

  const seoDescription: string | undefined =
    markdownContent.node.frontmatter.seo?.description && markdownContent.node.frontmatter.seo.description !== 'none'
      ? markdownContent.node.frontmatter.seo.description
      : markdownContent.getExcerpt();
  const seoImageUrl: string | undefined =
    markdownContent.node.frontmatter.seo?.imageUrl && markdownContent.node.frontmatter.seo.imageUrl !== 'none'
      ? markdownContent.node.frontmatter.seo.imageUrl
      : undefined;
  const seoImageWidth: number | undefined = markdownContent.node.frontmatter.seo?.imageWidth;
  const seoImageHeight: number | undefined = markdownContent.node.frontmatter.seo?.imageHeight;
  const seoImageAlt: string | undefined =
    markdownContent.node.frontmatter.seo?.imageAlt && markdownContent.node.frontmatter.seo.imageAlt !== 'none'
      ? markdownContent.node.frontmatter.seo.imageAlt
      : undefined;

  const markdownTemplateTagRenderer: TemplateTagRenderer = markdownContent.getTemplateTagRenderer();

  return (
    <Head
      seo={{
        description: seoDescription,
        imageUrl: seoImageUrl,
        imageWidth: seoImageWidth,
        imageHeight: seoImageHeight,
        imageAlt: seoImageAlt,
      }}
      templateTagRenderer={markdownTemplateTagRenderer}
    >
      {props.children}
    </Head>
  );
}
