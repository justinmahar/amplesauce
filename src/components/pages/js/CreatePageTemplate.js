// import { graphql } from 'gatsby';
import React from 'react';
import TsxCreatePageTemplate from '../CreatePageTemplate';

// This component is a wrapper for the TSX layout component of the same name.
// It needs to be a JS file because it's loaded directly in gatsby-node.js.

function CreatePageTemplate(props) {
  return <TsxCreatePageTemplate {...props} />;
}

export default CreatePageTemplate;

// export const query = graphql`
//   query CreatePageComponentQuery($slug: String!) {
//     examplesYaml(fields: { slug: { eq: $slug } }) {
//       name
//       value
//     }
//   }
// `;
