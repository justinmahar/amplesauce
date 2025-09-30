import dateFormat from 'dateformat';
import { Link } from 'gatsby';
import React, { JSX } from 'react';
import { Image } from 'react-bootstrap';
import { useSiteSettingsContext } from '../../contexts/SiteSettingsProvider';
import MarkdownContent, { MarkdownNode } from '../../markdown/MarkdownContent';

interface MarkdownPostBoxProps {
  markdownNode: MarkdownNode;
}

export const MarkdownPostBox = (props: MarkdownPostBoxProps): JSX.Element => {
  const siteSettings = useSiteSettingsContext();
  const markdownContent: MarkdownContent = new MarkdownContent(props.markdownNode);
  const imageUrl = markdownContent.node.frontmatter.seo?.imageUrl ?? siteSettings?.data.site.siteMetadata.siteImage;
  const frontmatterDate = markdownContent.node.frontmatter.date;
  const showDate = !!markdownContent.node.frontmatter.showDate;
  const dateString = dateFormat(frontmatterDate, 'mmmm dS, yyyy');
  const link = `/${markdownContent.node.fields.slug}`;
  return (
    <div className="d-flex flex-column justify-content-center align-items-center gap-2">
      <Link to={link}>
        <Image src={imageUrl} width={200} />
      </Link>
      <Link to={link} className="text-reset fs-4 text-decoration-none text-center" style={{ maxWidth: 200 }}>
        {markdownContent.node.frontmatter.title}
      </Link>
    </div>
  );
};
