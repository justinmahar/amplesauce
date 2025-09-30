import { graphql } from 'gatsby';
import { TemplateTagRenderer } from '../template-tags/TemplateTagRenderer';

/** 
  This fragment will be available globally using [Gatsby's GraphQL API](https://www.gatsbyjs.org/docs/graphql-reference/#fragments).
  
  To use: 
  ```graphql
  {
    allMarkdownRemark {
      nodes {
        ...markdownContent
      }
    }
  }
  ```
  */
export const markdownFragmentQuery = graphql`
  fragment markdownContent on MarkdownRemark {
    id
    fields {
      slug
    }
    excerpt
    html
    htmlAst
    rawMarkdownBody
    # IMPORTANT: Be sure to add new frontmatter specs to content/frontmatter-specs.markdown
    frontmatter {
      title
      slug
      excerpt
      seo {
        title
        description
        imageUrl
        imageWidth
        imageHeight
        imageAlt
      }
      partial
      private
      group
      category
      date
      showDate
    }
  }
`;
// ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑
// Important: The shapes of the query above and the type below must match!
// ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
export type MarkdownNode = {
  id: string;
  fields: {
    slug: string;
  };
  excerpt: string;
  html: string;
  htmlAst: any;
  rawMarkdownBody: string;
  // IMPORTANT: Be sure to add new frontmatter specs to content/frontmatter-specs.markdown
  frontmatter: {
    title: string;
    slug?: string;
    excerpt?: string;
    seo?: {
      title?: string;
      description?: string;
      imageUrl?: string;
      imageWidth?: number;
      imageHeight?: number;
      imageAlt?: string;
    };
    partial?: string;
    private?: string;
    group?: string;
    category?: string;
    date?: Date;
    showDate?: boolean;
  };
};

// === === === === === === === === ===

/**
 * `MarkdownContent` is Markdown content that includes frontmatter and commonly used fields.
 * Use the `...markdownContent` graphql fragment to get all fields needed
 * to construct one. Then pass each Markdown node into the constructor.
 */
export default class MarkdownContent {
  constructor(public node: MarkdownNode) {}

  public getExcerpt(): string {
    return this.node.frontmatter.excerpt && this.node.frontmatter.excerpt !== 'none'
      ? this.node.frontmatter.excerpt
      : // Use automatic Markdown excerpt.
        // We are removing the space that's added after components, before punctuation.
        // In most cases, we don't want that space there.
        this.node.excerpt.replace(/(\w) ([,.!?):;])/g, '$1$2');
  }

  public getTemplateTagRenderer(): TemplateTagRenderer {
    return new TemplateTagRenderer({
      contentTitle: this.node.frontmatter.title,
      contentExcerpt: this.getExcerpt(),
      contentSeoTitle: this.node.frontmatter.seo?.title ? this.node.frontmatter.seo.title : this.node.frontmatter.title,
      contentSeoDescription: this.node.frontmatter.seo?.description
        ? this.node.frontmatter.seo.description
        : this.getExcerpt(),
    });
  }
}
