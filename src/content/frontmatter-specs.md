---
title: Frontmatter Specs
slug: frontmatter-specs
excerpt: none
seo:
  title: none
  description: none
  imageUrl: none
  imageWidth: 1200
  imageHeight: 630
  imageAlt: none
partial: true
private: false
category: none
group: none
date: 1970-01-01
showDate: true
---

**Important: Be sure to add all new frontmatter specs to this file and `src/components/core-extended/markdown/MarkdownContent.ts`.**

This file has all frontmatter fields defined so that their types can be inferred by Gatsby's GraphQL system.

This file also makes all frontmatter in Markdown files optional except for `title`.

This Markdown file is set as a partial, so it will not be generated as a page.

In any Markdown file except this one:

- All fields except `title` are optional.
- Anything not specified, or set to `none`, is ignored.
- When not specified, slugs are created from titles. They are stripped of stop words, made lowercase, and all non-alphanumerics are converted to dashes.
- `partial` - Set to `true` to make Markdown into a partial. No page will be created by Gatsby, and it can be included on any page using the `MarkdownPartial` component.
- `private` - Set to `true` to make Markdown page private. It will not be included in `sitemap.xml` and its path will be prefixed with the `privatePagePathPrefix` value defined in `src/settings/settings.yml`.
  - You can also hide pages from search engines with the `sitemapExclude` site setting.

See the [Launchpad README](https://github.com/justinmahar/gatsby-launchpad#included-frontmatter) for more information on frontmatter.
