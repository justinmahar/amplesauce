/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

// NOTE: Site settings are located at: src/settings/settings.yml

/**
 * Some configurable settings are needed here, but they're outside Gatsby's GraphQL environment.
 * So, we'll use read-yaml to read them directly from the YAML files as JSON.
 */
import readYaml from 'read-yaml';
import versionMeta from './version-meta';

/** Load settings YAML */
export const settings = readYaml.sync(`${__dirname}/src/settings/settings.yml`, {});

// Add to site metadata
settings.siteMetadata.siteVersion = versionMeta.siteVersion;
settings.siteMetadata.siteBranchName = versionMeta.siteBranchName;
settings.siteMetadata.siteCommitHash = versionMeta.siteCommitHash;
settings.siteMetadata.siteEnvironment = versionMeta.siteEnvironment;
settings.siteMetadata.siteBuildTime = Date.now();

// Ensure there is no trailing slash on the Site URL
settings.siteMetadata.siteUrl = settings.siteMetadata.siteUrl.replace(/(.*)[/]+$/, '$1');
// Replace siteUrl template tag in siteImage
settings.siteMetadata.siteImage = settings.siteMetadata.siteImage.replace('{siteUrl}', settings.siteMetadata.siteUrl);

// == PWA Manifest Plugin Setup ==
// For more info on PWA support, see: https://www.gatsbyjs.com/plugins/gatsby-plugin-manifest/
/** These options are passed directly into the manifest plugin. */
export const gatsbyPluginManifestOptions = {
  name: settings.gatsbyPluginManifestOptions.name,
  short_name: settings.gatsbyPluginManifestOptions.shortName,
  start_url: settings.gatsbyPluginManifestOptions.startUrl,
  theme_color: settings.gatsbyPluginManifestOptions.themeColor,
  background_color: settings.gatsbyPluginManifestOptions.backgroundColor,
  display: settings.gatsbyPluginManifestOptions.display,
  icon:
    settings.gatsbyPluginManifestOptions.customIcon !== 'none'
      ? settings.gatsbyPluginManifestOptions.customIcon
      : settings.siteMetadata.siteIcon,
  // icon_options: {
  //   purpose: `maskable any`, // Image has icon masks and safe zone in mind, and is for use in any context. - https://w3c.github.io/manifest/#purpose-member
  // },
  // include_favicon: false, // This will exclude favicon link tag - https://www.gatsbyjs.com/plugins/gatsby-plugin-manifest/#disable-favicon
};
// Fix path to icon:
// Gatsby serves content in static without "static" in the path, but here
// the path must be relative to the project root. So we add in static before the path.
if (gatsbyPluginManifestOptions.icon) {
  gatsbyPluginManifestOptions.icon =
    'static' + (gatsbyPluginManifestOptions.icon.startsWith('/') ? '' : '/') + gatsbyPluginManifestOptions.icon;
}
// == END PWA Manifest Plugin Setup ==

export const plugins: (string | Record<string, any>)[] = [
  {
    resolve: `gatsby-plugin-manifest`,
    options: {
      ...gatsbyPluginManifestOptions,
    },
  },
  {
    resolve: 'gatsby-plugin-offline',
    options: {
      workboxConfig: {
        importWorkboxFrom: `cdn`,
        runtimeCaching: [
          {
            urlPattern: /.*/,
            // https://developers.google.com/web/tools/workbox/modules/workbox-strategies#network_first_network_falling_back_to_cache
            handler: `NetworkFirst`,
          },
        ],
      },
    },
  },
  {
    resolve: `gatsby-plugin-sitemap`,
    options: {
      excludes: [`/${settings.privatePagePathPrefix}/**`, ...settings.sitemapExclude],
    },
  },
  // `gatsby-plugin-remove-serviceworker`, // Uncomment when gatsby-plugin-offline disabled
  `gatsby-plugin-react-helmet`,
  `gatsby-plugin-sass`,
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `md-source`,
      path: `${__dirname}/src/content`,
    },
  },
  {
    resolve: `gatsby-transformer-remark`,
    options: {
      plugins: [
        {
          // For line numbering/highlights and more, see:
          // https://www.gatsbyjs.org/packages/gatsby-remark-prismjs
          resolve: 'gatsby-remark-prismjs',
          options: {
            classPrefix: 'language-',
            // Use this string to denote which language to use in inline code blocks.
            // Example: `js:::let finalBoss = "Bowser"`
            // The js::: part is removed and everything after it is highlighted as js.
            inlineCodeMarker: ':::',
            aliases: {},
          },
        },
      ],
    },
  },
  `gatsby-transformer-yaml`,
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `yml-settings`,
      path: `${__dirname}/src/settings`,
    },
  },
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `images`,
      path: `${__dirname}/static/media`,
    },
  },
  `gatsby-transformer-sharp`,
  `gatsby-plugin-sharp`,
  `gatsby-plugin-netlify`,
  `gatsby-plugin-styled-components`,
  `gatsby-plugin-no-sourcemaps`,
  {
    resolve: 'gatsby-plugin-web-font-loader',
    options: {
      google: {
        families: ['Playfair Display:700', 'Nunito Sans:400,700'],
      },
    },
  },
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `yml-examples`,
      path: `${__dirname}/src/data/examples`,
    },
  },
];

// == Google Analytics ==
// https://www.gatsbyjs.com/plugins/gatsby-plugin-google-gtag/
// Only add the analytics plugin if there's a measurement ID specified
if (settings.googleAnalyticsMeasurementId !== 'none') {
  plugins.push({
    resolve: `gatsby-plugin-google-gtag`,
    options: {
      trackingIds: [
        settings.googleAnalyticsMeasurementId, // Google Analytics / GA
      ],
    },
  });
}
// == End Analytics ==

// == Robots ==
plugins.push({
  resolve: `gatsby-plugin-robots-txt`,
  options: {
    policy: settings.robotsDisallowed ? [{ userAgent: '*', disallow: '/' }] : [{ userAgent: '*', allow: '/' }],
    sitemap: `${settings.siteMetadata.siteUrl}/sitemap-index.xml`,
  },
});

// https://www.gatsbyjs.com/docs/reference/release-notes/v2.28/#feature-flags-in-gatsby-configjs
export const flags = {};

export default {
  graphqlTypegen: {
    typesOutputPath: `.cache/gatsby-types.d.ts`,
  },
  flags: { flags },
  siteMetadata: {
    ...settings.siteMetadata,
  },
  plugins: [...plugins],
};
