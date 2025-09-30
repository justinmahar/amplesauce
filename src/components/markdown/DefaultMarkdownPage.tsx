import dateFormat from 'dateformat';
import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import Body from '../layout/Body';
import Layout from '../layout/Layout';
import MarkdownContent from './MarkdownContent';
import { MarkdownRenderer } from './MarkdownRenderer';
import { TemplateTagRenderer } from '../template-tags/TemplateTagRenderer';
import MarkdownHead from './MarkdownHead';
import { SectionBackground } from '../sections/parts/SectionBackground';

interface Props {
  markdownContent: MarkdownContent;
  templateTagRenderer: TemplateTagRenderer;
}

export default function DefaultMarkdownPage({ markdownContent, templateTagRenderer }: Props) {
  const contentTitle = templateTagRenderer.render(markdownContent.node.frontmatter.title);

  // Set to true to show the date
  const showDate = false;
  let dateString = '';
  if (markdownContent.node.frontmatter.date) {
    dateString = dateFormat('mmmm dS, yyyy');
  }

  return (
    <Layout>
      <MarkdownHead markdownContent={markdownContent} />
      <Body>
        <SectionBackground first>
          <Container>
            <Row>
              <Col md={{ span: 10, offset: 1 }} lg={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
                <Card className="shadow">
                  <Card.Header>
                    <h2 className="m-1">{contentTitle}</h2>
                  </Card.Header>
                  <Card.Body className="p-4">
                    {showDate && <p className="text-muted ps-1 mb-4 font-italic">{dateString}</p>}
                    <p />
                    <MarkdownRenderer markdownContent={markdownContent}>
                      {markdownContent.node.htmlAst}
                    </MarkdownRenderer>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </SectionBackground>
      </Body>
    </Layout>
  );
}
