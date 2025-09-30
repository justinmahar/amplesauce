import classNames from 'classnames';
import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { DivProps } from 'react-html-props';
import { useQueryParamString } from 'react-use-query-param-string';
import { MarkdownPostBox } from './parts/MarkdownPostBox';
import { SectionBackground } from './parts/SectionBackground';
import { useThemeContext } from '../contexts/ThemeProvider';
import { MarkdownNode } from '../markdown/MarkdownContent';
import { Gradients } from '../misc/Gradients';

export interface BasicPostsSectionProps extends DivProps {
  first?: boolean;
}

export const BasicPostsSection = ({ ...props }: BasicPostsSectionProps) => {
  const theme = useThemeContext();
  const yPadding = 150;
  const darkModeBackground = `url(/media/noise.png) top center/220px repeat,
  radial-gradient(circle at 17% 77%, rgba(17, 17, 17,0.04) 0%, rgba(17, 17, 17,0.04) 50%,rgba(197, 197, 197,0.04) 50%, rgba(197, 197, 197,0.04) 100%),radial-gradient(circle at 26% 17%, rgba(64, 64, 64,0.04) 0%, rgba(64, 64, 64,0.04) 50%,rgba(244, 244, 244,0.04) 50%, rgba(244, 244, 244,0.04) 100%),radial-gradient(circle at 44% 60%, rgba(177, 177, 177,0.04) 0%, rgba(177, 177, 177,0.04) 50%,rgba(187, 187, 187,0.04) 50%, rgba(187, 187, 187,0.04) 100%),linear-gradient(19deg, rgb(28, 117, 250),rgb(34, 2, 159))
`;
  const lightModeBackground = `url(/media/noise.png) top center/220px repeat,
  radial-gradient(circle at 85% 1%, hsla(190,0%,93%,0.05) 0%, hsla(190,0%,93%,0.05) 96%,transparent 96%, transparent 100%),radial-gradient(circle at 14% 15%, hsla(190,0%,93%,0.05) 0%, hsla(190,0%,93%,0.05) 1%,transparent 1%, transparent 100%),radial-gradient(circle at 60% 90%, hsla(190,0%,93%,0.05) 0%, hsla(190,0%,93%,0.05) 20%,transparent 20%, transparent 100%),radial-gradient(circle at 79% 7%, hsla(190,0%,93%,0.05) 0%, hsla(190,0%,93%,0.05) 78%,transparent 78%, transparent 100%),radial-gradient(circle at 55% 65%, hsla(190,0%,93%,0.05) 0%, hsla(190,0%,93%,0.05) 52%,transparent 52%, transparent 100%),linear-gradient(135deg, rgb(37, 56, 222),rgb(96, 189, 244))
`;
  const backgroundBlendMode = 'overlay, normal';
  const darkModeEnabled = true;
  const textClass = darkModeEnabled ? 'text-white' : 'text-black';

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
        <MarkdownPostBox markdownNode={node} />
      </div>
    );
  });

  const noPosts = postNodes.length === 0;
  const hideWhenZeroPosts = false;

  const darkModeGradientStyles = Gradients.cssToStyleProps(
    'background-image: linear-gradient(216deg, rgba(77, 77, 77,0.05) 0%, rgba(77, 77, 77,0.05) 25%,rgba(42, 42, 42,0.05) 25%, rgba(42, 42, 42,0.05) 38%,rgba(223, 223, 223,0.05) 38%, rgba(223, 223, 223,0.05) 75%,rgba(36, 36, 36,0.05) 75%, rgba(36, 36, 36,0.05) 100%),linear-gradient(44deg, rgba(128, 128, 128,0.05) 0%, rgba(128, 128, 128,0.05) 34%,rgba(212, 212, 212,0.05) 34%, rgba(212, 212, 212,0.05) 57%,rgba(25, 25, 25,0.05) 57%, rgba(25, 25, 25,0.05) 89%,rgba(135, 135, 135,0.05) 89%, rgba(135, 135, 135,0.05) 100%),linear-gradient(241deg, rgba(55, 55, 55,0.05) 0%, rgba(55, 55, 55,0.05) 14%,rgba(209, 209, 209,0.05) 14%, rgba(209, 209, 209,0.05) 60%,rgba(245, 245, 245,0.05) 60%, rgba(245, 245, 245,0.05) 69%,rgba(164, 164, 164,0.05) 69%, rgba(164, 164, 164,0.05) 100%),linear-gradient(249deg, rgba(248, 248, 248,0.05) 0%, rgba(248, 248, 248,0.05) 32%,rgba(148, 148, 148,0.05) 32%, rgba(148, 148, 148,0.05) 35%,rgba(202, 202, 202,0.05) 35%, rgba(202, 202, 202,0.05) 51%,rgba(181, 181, 181,0.05) 51%, rgba(181, 181, 181,0.05) 100%),linear-gradient(92deg, hsl(214,0%,11%),hsl(214,0%,11%));',
  );
  const lightModeGradientStyles = Gradients.cssToStyleProps(
    'background-image: linear-gradient(16deg, rgba(116, 116, 116,0.02) 0%, rgba(116, 116, 116,0.02) 25%,transparent 25%, transparent 96%,rgba(177, 177, 177,0.02) 96%, rgba(177, 177, 177,0.02) 100%),linear-gradient(236deg, rgba(148, 148, 148,0.02) 0%, rgba(148, 148, 148,0.02) 53%,transparent 53%, transparent 59%,rgba(56, 56, 56,0.02) 59%, rgba(56, 56, 56,0.02) 100%),linear-gradient(284deg, rgba(16, 16, 16,0.02) 0%, rgba(16, 16, 16,0.02) 46%,transparent 46%, transparent 71%,rgba(181, 181, 181,0.02) 71%, rgba(181, 181, 181,0.02) 100%),linear-gradient(316deg, rgba(197, 197, 197,0.02) 0%, rgba(197, 197, 197,0.02) 26%,transparent 26%, transparent 49%,rgba(58, 58, 58,0.02) 49%, rgba(58, 58, 58,0.02) 100%),linear-gradient(90deg, rgb(255,255,255),rgb(255,255,255));',
  );
  const gradientStyles = theme.darkModeEnabled ? darkModeGradientStyles : lightModeGradientStyles;

  if (!hideWhenZeroPosts || (hideWhenZeroPosts && !noPosts)) {
    return (
      <SectionBackground
        gradientStyles={gradientStyles}
        bgStyle={{ opacity: theme.darkModeEnabled ? 0.5 : 1 }}
        spacing={{ xs: 60, lg: 120 }}
        {...props}
        className={classNames(props.className)}
        style={{ ...props.style }}
      >
        <Container>
          <Row>
            <Col>
              <div>
                {!noPosts && (
                  <>
                    <h3 className="text-center">Latest Posts</h3>
                    <div className="d-flex flex-wrap justify-content-center align-items-start px-2 py-5 gap-5">
                      {postElements}
                    </div>
                  </>
                )}
                {noPosts && <h4 className="mb-0 px-4 text-center">Stay tuned. New posts are coming soon.</h4>}
              </div>
            </Col>
          </Row>
        </Container>
      </SectionBackground>
    );
  } else {
    return <></>;
  }
};
