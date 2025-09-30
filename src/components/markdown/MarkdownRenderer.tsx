import { Link } from 'gatsby-link';
import React, { JSX } from 'react';
import { Button, Image, Table } from 'react-bootstrap';
import { DivPropsWithoutRef } from 'react-html-props';
import RehypeReact from 'rehype-react';
import styled from 'styled-components';
import YouTube from 'react-youtube';
import MarkdownContent from './MarkdownContent';
import { TemplateText } from '../template-tags/TemplateText';

interface MarkdownRendererProps extends DivPropsWithoutRef {
  components?: { [component: string]: (props: any) => JSX.Element };
  markdownContent?: MarkdownContent;
}

export const MarkdownRenderer = ({
  children: htmlAst,
  markdownContent,
  components,
  ...divProps
}: MarkdownRendererProps): JSX.Element => {
  // See: https://using-remark.gatsbyjs.org/custom-components/
  const renderAst = new (RehypeReact as any)({
    createElement: React.createElement,
    // Define custom markdown components here.
    components: {
      // p: (props: any) => <p className="bg-primary">{props.children}</p>, // Paragraph
      h1: (props: any) => (
        <a
          {...{ name: createAnchorId(`${props.children}`) }}
          id={createAnchorId(`${props.children}`)}
          className="text-decoration-none text-reset"
          style={{ scrollMarginTop: 70 }}
        >
          <h1>{props.children}</h1>
        </a>
      ), // Heading 1 #
      h2: (props: any) => (
        <a
          {...{ name: createAnchorId(`${props.children}`) }}
          id={createAnchorId(`${props.children}`)}
          className="text-decoration-none text-reset"
          style={{ scrollMarginTop: 70 }}
        >
          <h2>{props.children}</h2>
        </a>
      ), // Heading 2 ##
      h3: (props: any) => (
        <a
          {...{ name: createAnchorId(`${props.children}`) }}
          id={createAnchorId(`${props.children}`)}
          className="text-decoration-none text-reset"
          style={{ scrollMarginTop: 70 }}
        >
          <h3>{props.children}</h3>
        </a>
      ), // Heading 3 ###
      h4: (props: any) => (
        <a
          {...{ name: createAnchorId(`${props.children}`) }}
          id={createAnchorId(`${props.children}`)}
          className="text-decoration-none text-reset"
          style={{ scrollMarginTop: 70 }}
        >
          <h4>{props.children}</h4>
        </a>
      ), // Heading 4 ####
      h5: (props: any) => (
        <a
          {...{ name: createAnchorId(`${props.children}`) }}
          id={createAnchorId(`${props.children}`)}
          className="text-decoration-none text-reset"
          style={{ scrollMarginTop: 70 }}
        >
          <h5>{props.children}</h5>
        </a>
      ), // Heading 5 #####
      h6: (props: any) => (
        <a
          {...{ name: createAnchorId(`${props.children}`) }}
          id={createAnchorId(`${props.children}`)}
          className="text-decoration-none text-reset"
          style={{ scrollMarginTop: 70 }}
        >
          <h6>{props.children}</h6>
        </a>
      ), // Heading 6 ######
      blockquote: (props: any) => <StyledBlockquote>{props.children}</StyledBlockquote>, // Blockquote >
      // ul: (props: any) => <ul>{props.children}</ul>, // List -
      // ol: (props: any) => <ol>{props.children}</ol>, // Ordered list 1.
      // li: (props: any) => <li>{props.children}</li>, // List item
      table: (props: any) => (
        <Table striped bordered responsive>
          {props.children}
        </Table>
      ), // Table
      // thead: (props: any) => <thead>{props.children}</thead>, // Table head
      // tbody: (props: any) => <tbody>{props.children}</tbody>, // Table body
      // tr: (props: any) => <tr>{props.children}</tr>, // Table row
      // td: (props: any) => <td>{props.children}</td>, // Table cell
      // th: (props: any) => <th>{props.children}</th>, // Table header
      // code: (props: any) => <code>{props.children}</code>, // Code ```code```
      // inlineCode: (props: any) => <code>{props.children}</code>, // InlineCode `inlineCode`
      // pre: (props: any) => <pre>{props.children}</pre>, // Code ```code```
      // em: (props: any) => <em>{props.children}</em>, // Emphasis _emphasis_
      // strong: (props: any) => <strong>{props.children}</strong>, // Strong **strong**
      // del: (props: any) => <del>{props.children}</del>, // Delete ~~strikethrough~~
      // hr: (props: any) => <hr />, // Thematic break --- or ***
      // a: ({ children, ...aProps }: any) => <a {...aProps}>{children}</a>, // Link <https://google.com> or [MDX](https://google.com)
      img: (props: any) => <Image {...props} fluid rounded />, // Image ![alt](https://google.com/kitten.jpg)
      // Use template tags, i.e. <template text="{year}"></template>
      template: (props: any) => <>{<TemplateText text={props.text ?? ''} markdownContent={markdownContent} />}</>,
      // Gatsby link
      'gatsby-link': ({ children, ...props }: any) => <>{<Link {...props}>{children}</Link>}</>,
      glink: ({ children, ...props }: any) => <>{<Link {...props}>{children}</Link>}</>,
      youtube: (props: any) => (
        <div className="d-flex justify-content-center">
          <YouTube
            {...props}
            videoId={props.videoid}
            opts={{
              width: props.width ?? '300',
              height: props.height ?? '200',
              playerVars: { autoplay: 0, modestbranding: 1, playsinline: 0 },
            }}
          />
        </div>
      ),
      // Define custom components like so:
      'custom-component': (props: any) => (
        <Button {...props} onClick={() => alert('Click!')}>
          {props.children}
        </Button>
      ), // Use in markdown like so (all props treated as strings): <custom-component className="shadow">Click Me!</custom-component>
      ...components,
    },
  }).Compiler;

  return <WrapperDiv {...divProps}>{renderAst(htmlAst)}</WrapperDiv>;
};

const StyledBlockquote = styled.blockquote`
  background: #f9f9f9;
  border-left: 10px solid #ccc;
  margin: 1.5em 10px;
  padding: 0.5em 10px;
  // Ensure no bottom margin exists on the last direct child
  > *:last-child {
    margin-bottom: 0;
  }
`;

const WrapperDiv = styled.div`
  // Break code within a word to prevent overflow when an otherwise-unbreakable string is too long to fit within the line box
  .language-text {
    overflow-wrap: break-word !important;
  }
`;

const createAnchorId = (text: string): string => {
  return text.toLowerCase().split('&').join('').split(/\W/).join('-');
};
