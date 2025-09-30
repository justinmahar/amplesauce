/**
 * Gatsby gives plugins and site builders many APIs for controlling your site.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
import path from 'path';
import * as util from './util';
import readYaml from 'read-yaml';
import versionMeta from './version-meta';

/**
 * Gatsby gives plugins and site builders many APIs for controlling your site.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

/** Load settings YAML */
const settings = readYaml.sync(`${__dirname}/src/settings/settings.yml`);

export const onCreateNode = (helpers) => {
  const { node, actions } = helpers;
  const { createNodeField } = actions;

  if (node.internal.type === 'MarkdownRemark') {
    // Use frontmatter slug as-is if provided, otherwise slugify the title
    let slugValue = node.frontmatter.slug;
    if (!slugValue) {
      slugValue = util.slugify(node.frontmatter.title);
    }
    createNodeField({
      // Name of the field you are adding
      name: 'slug',
      // Individual MDX node
      node,
      // Slug for the content
      value: slugValue,
    });
  }

  // We only want to operate on our custom nodes.
  if (node.internal.type === 'ExamplesYaml') {
    // TODO: Create your node's slug here.
    const slugValue = util.slugify(node.name);
    createNodeField({
      // Name of the field you are adding
      name: 'slug',
      // Individual node
      node,
      // Slug for the content
      value: slugValue,
    });
  }
};

export const createPages = ({ graphql, actions }) => {
  // Destructure actions object for the functions we need
  const { createRedirect, createPage } = actions;

  // Create redirects configured in settings.yml
  // See: https://www.gatsbyjs.com/docs/reference/config-files/actions/#createRedirect
  const redirects = Array.isArray(settings.redirects) ? settings.redirects : [];
  redirects.forEach((redirect) => createRedirect(redirect));

  const markdownQueryPromise = graphql(`
    query NodeMarkdownQuery {
      allMarkdownRemark {
        nodes {
          fields {
            slug
          }
          frontmatter {
            partial
            private
          }
        }
      }
      settingsYaml {
        privatePagePathPrefix
      }
    }
  `).then((result) => {
    // This is some boilerplate to handle errors
    if (result.errors) {
      console.error(result.errors);
      Promise.reject(result.errors);
    }

    const privatePagePathPrefix = result.data.settingsYaml.privatePagePathPrefix;

    const markdownNodes = result.data.allMarkdownRemark.nodes;

    const markdownPageTemplate = path.resolve(`${__dirname}/src/components/markdown/js/MarkdownPageTemplate.js`);

    // We'll call `createPage` for each result, creating each page.
    markdownNodes.forEach((node) => {
      if (node.fields.slug) {
        // Don't create pages for partials
        if (!node.frontmatter.partial) {
          const pageConfig = {
            // We'll use the slug we created in onCreateNode, in addition to a private path prefix if private
            path: `${node.frontmatter.private ? `${privatePagePathPrefix}/` : ''}${node.fields.slug}`,
            // This component will wrap our Markdown content
            component: markdownPageTemplate,
            // Data passed to context is available in props, and in page queries as GraphQL variables.
            context: {
              slug: node.fields.slug,
            },
          };
          // https://www.gatsbyjs.org/docs/actions/#createPage
          createPage(pageConfig);
        }
      }
    });
  });

  const createExamplePages = false;

  const dataQueryPromise = graphql(`
    query DataQuery {
      allExamplesYaml {
        nodes {
          fields {
            slug
          }
          name
          value
        }
      }
    }
  `).then((result) => {
    // This is some boilerplate to handle errors
    if (result.errors) {
      console.error(result.errors);
      Promise.reject(result.errors);
    }

    const nodes = result.data.allExamplesYaml.nodes;
    const pageTemplate = path.resolve(`${__dirname}/src/components/custom/pages/js/CreatePageTemplate.js`);

    // We'll call `createPage` for each node of data, creating each page.
    nodes.forEach((node) => {
      const pageConfig = {
        // We'll use the slug we created in onCreateNode
        path: `examples/${node.fields.slug}`,
        // This component will wrap our content
        component: pageTemplate,
        // Data passed to context is available in props, and in page queries as GraphQL variables.
        context: {
          slug: node.fields.slug,
        },
      };
      // https://www.gatsbyjs.org/docs/actions/#createPage
      if (createExamplePages) {
        createPage(pageConfig);
      }
    });
  });

  // On running multiple queries:
  // https://swas.io/blog/using-multiple-queries-on-gatsbyjs-createpages-node-api/
  return Promise.all([markdownQueryPromise, dataQueryPromise]);
};

export const onCreateWebpackConfig = ({ stage, loaders, actions, plugins }) => {
  actions.setWebpackConfig({
    plugins: [
      plugins.define({
        __COMMIT_HASH__: JSON.stringify(versionMeta.siteCommitHash),
        __BRANCH_NAME__: JSON.stringify(versionMeta.siteBranchName),
        __ENVIRONMENT__: JSON.stringify(versionMeta.siteEnvironment),
        __SITE_VERSION__: JSON.stringify(versionMeta.siteVersion),
      }),
    ],
  });
};
