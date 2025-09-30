import React, { JSX } from 'react';
import MarkdownContent, { MarkdownNode } from './MarkdownContent';
import { MarkdownRenderer } from './MarkdownRenderer';

interface Props {
  markdownNode: MarkdownNode;
}
export const MarkdownNodeRenderer = ({ markdownNode }: Props): JSX.Element => {
  return (
    <MarkdownRenderer markdownContent={new MarkdownContent(markdownNode)}>{markdownNode.htmlAst}</MarkdownRenderer>
  );
};
