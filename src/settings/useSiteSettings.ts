import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import { FUNCTIONS_EMULATOR_ENABLED } from '../components/firebase/firebase-app';
import { TemplateTagRenderer } from '../components/template-tags/TemplateTagRenderer';

export const siteSettingsQuery = graphql`
  query SiteSettingsQuery {
    site {
      siteMetadata {
        siteName
        siteDescription
        siteImage
        siteImageWidth
        siteImageHeight
        siteImageAlt
        siteIcon
        siteIconAlt
        siteUrl
        siteVersion
        siteBranchName
        siteCommitHash
        siteEnvironment
        siteBuildTime
      }
    }
    settingsYaml {
      seoTitleFormat
      seoTitleSeparator
      privatePagePathPrefix
      sitemapExclude
      googleAnalyticsMeasurementId
      robotsDisallowed
      twitterSiteUsername
      cloudFunctionsRootLocal
      cloudFunctionsRootProduction
      trackVisits
      googleFormContact {
        formAction
        subjectName
        messageName
        originName
      }
      netlifyBadgeMarkdown
      sitePasswordHash
      postLoginRoute
      headerHeight
      edgeFunctionsRoot
      googleOauthClientId
      promptEndpoint
    }
  }
`;
// ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑
// Important: The shapes of the query above and the type below must match!
// ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
export type SiteSettingsData = {
  site: {
    siteMetadata: {
      siteName: string;
      siteDescription: string;
      siteImage: string;
      siteImageWidth: number;
      siteImageHeight: number;
      siteImageAlt: string;
      siteIcon: string;
      siteIconAlt: string;
      siteUrl: string;
      siteVersion: string;
      siteBranchName: string;
      siteCommitHash: string;
      siteEnvironment: string;
      siteBuildTime: number;
    };
  };
  settingsYaml: {
    seoTitleFormat: string;
    seoTitleSeparator: string;
    privatePagePathPrefix: string;
    sitemapExclude: string[];
    googleAnalyticsMeasurementId: string;
    robotsDisallowed: boolean;
    twitterSiteUsername: string;
    cloudFunctionsRootLocal: string;
    cloudFunctionsRootProduction: string;
    trackVisits: boolean;
    googleFormContact: {
      formAction: string;
      subjectName: string;
      messageName: string;
      originName: string;
    };
    netlifyBadgeMarkdown: string;
    sitePasswordHash: string;
    postLoginRoute: string;
    headerHeight: number;
    edgeFunctionsRoot: string;
    googleOauthClientId: string;
    promptEndpoint: string;
  };
};

// === === === === === === === === ===

export default class SiteSettings {
  constructor(public data: SiteSettingsData) {}

  public getCloudFunctionsRoot(): string {
    return FUNCTIONS_EMULATOR_ENABLED && this.data.site.siteMetadata.siteEnvironment === 'development'
      ? this.data.settingsYaml.cloudFunctionsRootLocal
      : this.data.settingsYaml.cloudFunctionsRootProduction;
  }

  public getTemplateTagRenderer(): TemplateTagRenderer {
    return new TemplateTagRenderer({
      siteName: this.data.site.siteMetadata.siteName,
      siteDescription: this.data.site.siteMetadata.siteDescription,
      siteImage: this.data.site.siteMetadata.siteImage,
      siteImageAlt: this.data.site.siteMetadata.siteImageAlt,
      siteIcon: this.data.site.siteMetadata.siteIcon,
      siteIconAlt: this.data.site.siteMetadata.siteIconAlt,
      siteUrl: this.data.site.siteMetadata.siteUrl,
      siteVersion: this.data.site.siteMetadata.siteVersion,
      siteBranchName: this.data.site.siteMetadata.siteBranchName,
      siteCommitHash: this.data.site.siteMetadata.siteCommitHash,
      siteEnvironment: this.data.site.siteMetadata.siteEnvironment,
      siteBuildTime: `${this.data.site.siteMetadata.siteBuildTime}`,
      seoTitleFormat: this.data.settingsYaml.seoTitleFormat,
      seoTitleSeparator: this.data.settingsYaml.seoTitleSeparator,
      privatePagePathPrefix: this.data.settingsYaml.privatePagePathPrefix,
      googleAnalyticsMeasurementId: this.data.settingsYaml.googleAnalyticsMeasurementId,
      twitterSiteUsername: this.data.settingsYaml.twitterSiteUsername,
      year: `${new Date().getFullYear()}`,
    });
  }
}

export const useSiteSettings = (): SiteSettings => {
  const data = useStaticQuery(siteSettingsQuery);
  return React.useMemo(() => new SiteSettings(data), [data]);
};
