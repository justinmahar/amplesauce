import dateFormat from 'dateformat';
import { Link } from 'gatsby';
import React, { JSX } from 'react';
import { Badge, Card } from 'react-bootstrap';
import { FiChevronsRight } from 'react-icons/fi';
import MarkdownContent, { MarkdownNode } from './MarkdownContent';
import { IconButton } from '../misc/IconButton';

interface MarkdownPostCardProps {
  markdownNode: MarkdownNode;
}

export const MarkdownPostCard = (props: MarkdownPostCardProps): JSX.Element => {
  const markdownContent: MarkdownContent = new MarkdownContent(props.markdownNode);
  const frontmatterDate = markdownContent.node.frontmatter.date;
  const showDate = !!markdownContent.node.frontmatter.showDate;
  const dateString = dateFormat(frontmatterDate, 'mmmm dS, yyyy');
  const link = `/${markdownContent.node.fields.slug}`;
  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h4 className="my-1">
          <Link to={link} className="text-decoration-none">
            {markdownContent.node.frontmatter.title}
          </Link>
        </h4>
        {frontmatterDate && showDate && (
          <div>
            <Badge>{dateString}</Badge>
          </div>
        )}
      </Card.Header>
      <Card.Body>
        <div>
          {markdownContent.getExcerpt()}{' '}
          <Link to={link} className="text-decoration-none">
            <IconButton icon={FiChevronsRight} end size="sm" variant="link">
              Read more
            </IconButton>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};
