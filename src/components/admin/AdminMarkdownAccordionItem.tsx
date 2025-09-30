import { graphql, Link, useStaticQuery } from 'gatsby';
import React from 'react';
import { Accordion } from 'react-bootstrap';
import { AccordionItemProps } from 'react-bootstrap/esm/AccordionItem';
import { useSiteSettingsContext } from '../contexts/SiteSettingsProvider';
import { MarkdownNode } from '../markdown/MarkdownContent';
import { key } from '../utils/utils';

interface Props extends AccordionItemProps {}

export const AdminMarkdownAccordionItem = (props: Props) => {
  const siteSettings = useSiteSettingsContext();
  const allMarkdownRemarkData: any = useStaticQuery(graphql`
    query MarkdownSettingsQuery {
      allMarkdownRemark {
        nodes {
          ...markdownContent
        }
      }
    }
  `);
  const sortedMarkdownNodes = (allMarkdownRemarkData.allMarkdownRemark.nodes as MarkdownNode[]).sort((a, b) =>
    a.fields.slug.localeCompare(b.fields.slug),
  );

  const partialNodes = sortedMarkdownNodes.filter((node) => !!node.frontmatter.partial);
  const partialMarkdownElements = partialNodes.map((markdownData, index) => {
    return <li key={key('markdown', index)}>{markdownData.fields.slug}</li>;
  });

  const pageNodes = sortedMarkdownNodes.filter((node) => !node.frontmatter.partial);
  const privatePageNodes = pageNodes.filter((markdownData) => markdownData.frontmatter.private);
  const publicPageNodes = pageNodes.filter((markdownData) => !markdownData.frontmatter.private);
  const pageMarkdownElements = [...publicPageNodes, ...privatePageNodes].map((markdownData, index) => {
    const route = `${
      markdownData.frontmatter.private ? '/' + siteSettings?.data.settingsYaml.privatePagePathPrefix : ''
    }/${markdownData.fields.slug}`;
    return (
      <li key={key('markdown', index)}>
        <Link to={route}>{route}</Link>
      </li>
    );
  });

  return (
    <Accordion.Item {...props}>
      <Accordion.Header>MDX Pages &amp; Partials</Accordion.Header>
      <Accordion.Body>
        <h6>Pages</h6>
        <ul>{pageMarkdownElements}</ul>
        <h6>Partials</h6>
        <ul>{partialMarkdownElements}</ul>
      </Accordion.Body>
    </Accordion.Item>
  );
};
