import { graphql, PageProps, useStaticQuery } from 'gatsby';
import * as React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useQueryParamString } from 'react-use-query-param-string';
import Body from '../layout/Body';
import Layout from '../layout/Layout';
import { MarkdownNode } from '../markdown/MarkdownContent';
import Head from '../layout/Head';
import { MarkdownPostCard } from '../markdown/MarkdownPostCard';
import { CancelableFormControl } from '../misc/CancelableFormControl';
import { SectionBackground } from '../sections/parts/SectionBackground';

export default function DefaultPostsPage(props: PageProps<any>): React.JSX.Element {
  const contentTitle = `Posts`;
  const description = `Newest posts`;

  const [searchText, setSearchText] = useQueryParamString('q', '');

  const postsData = useStaticQuery(graphql`
    query PostsQuery {
      posts: allMarkdownRemark(
        filter: { frontmatter: { partial: { ne: true }, private: { ne: true }, group: { eq: "posts" } } }
        sort: { frontmatter: { date: DESC } }
      ) {
        nodes {
          ...markdownContent
        }
      }
    }
  `);

  let postNodes: MarkdownNode[] = postsData?.posts?.nodes ? postsData.posts.nodes : [];
  postNodes = postNodes.filter(
    (node) =>
      node.rawMarkdownBody.toLowerCase().indexOf(searchText.toLowerCase()) >= 0 ||
      node.frontmatter.title.toLowerCase().indexOf(searchText.toLowerCase()) >= 0 ||
      (typeof node.frontmatter.category === 'string'
        ? (node.frontmatter.category as string).toLowerCase().indexOf(searchText.toLowerCase()) >= 0
        : false),
  );

  const postElements = postNodes.map((node: MarkdownNode) => {
    return (
      <div className="mb-4" key={node.id}>
        <MarkdownPostCard markdownNode={node} />
      </div>
    );
  });

  return (
    <Layout>
      <Head contentTitle={contentTitle} seo={{ description: description }} />
      <Body>
        <SectionBackground spacing={{ xs: 10, lg: 40 }} first>
          <Container>
            <Row>
              <Col md={{ offset: 2, span: 8 }}>
                <h2 className="mb-4">Posts</h2>
                <div className="mb-4">
                  <CancelableFormControl
                    type="text"
                    placeholder="Search..."
                    value={searchText}
                    onCancel={() => setSearchText('')}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
                  />
                </div>
                {postElements}
              </Col>
            </Row>
          </Container>
        </SectionBackground>
      </Body>
    </Layout>
  );
}
