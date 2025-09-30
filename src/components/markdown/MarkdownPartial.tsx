import { graphql, useStaticQuery } from 'gatsby';
import React, { JSX } from 'react';
import MarkdownContent, { MarkdownNode } from './MarkdownContent';
import { MarkdownRenderer } from './MarkdownRenderer';

export interface MarkdownPartialProps {
  slug: string;
}

export const MarkdownPartial = (props: MarkdownPartialProps): JSX.Element => {
  const partialsData: any = useStaticQuery(graphql`
    query PartialsQuery {
      allMarkdownRemark(filter: { frontmatter: { partial: { eq: true } } }) {
        nodes {
          ...markdownContent
        }
      }
    }
  `);

  const partialMarkdownNode: MarkdownNode = partialsData.allMarkdownRemark.nodes.find(
    (node: MarkdownNode) => node.fields.slug === props.slug,
  );

  if (partialMarkdownNode) {
    return (
      <MarkdownRenderer markdownContent={new MarkdownContent(partialMarkdownNode)}>
        {partialMarkdownNode.htmlAst}
      </MarkdownRenderer>
    );
  } else return <></>;
};
