import { graphql } from 'gatsby';
import React from 'react';
import TsxMarkdownPageTemplate from '../MarkdownPageTemplate';

// This component is a wrapper for the TSX layout component of the
// same name.
// It needs to be a JS file because it's loaded directly by the Markdown
// plug-in in gatsby-node.js.

function MarkdownPageTemplate(props) {
  return <TsxMarkdownPageTemplate {...props} />;
}

export default MarkdownPageTemplate;

export const query = graphql`
  query MarkdownPageComponentQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      ...markdownContent
    }
  }
`;
