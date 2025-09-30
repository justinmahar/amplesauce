---
title: Markdown Kitchen Sink
group: posts
date: 2021-04-23
---

Below, all markdown elements are present.

This page can be used to preview and customize how markdown is rendered by `MarkdownNodeRenderer`.

It can also be used as a quick markdown cheat sheet.

See the [README](https://github.com/justinmahar/gatsby-launchpad#customizing-rendered-markdown) for more rendering information.

---

# h1: Heading 1 `#`

## h2: Heading 2 `##`

### h3: Heading 3 `###`

#### h4: Heading 4 `####`

##### h5: Heading 5 `#####`

###### h6: Heading 6 `######`

p: Paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed id ligula ac ligula vulputate luctus sit amet ac ante. Duis iaculis elit vel neque elementum molestie. Praesent eleifend lacinia tellus et bibendum. Vivamus lobortis diam sit amet libero tincidunt, nec consectetur enim tincidunt. Phasellus erat magna, sollicitudin sed eros ut, convallis commodo neque.

p: Paragraph. Morbi mattis sapien nulla. Cras pellentesque neque eu sapien tempor, a porta justo sagittis. Donec libero est, malesuada efficitur erat sit amet, aliquam consectetur nibh. Nulla ultrices convallis viverra. Maecenas consequat sem molestie orci posuere, ac dignissim nisi varius. In tincidunt dui sit amet neque gravida mollis. Maecenas volutpat velit ex, vitae eleifend massa rutrum a. Sed elit nulla, mollis quis dictum ac, faucibus id augue.

p: Paragraph. Morbi mattis sapien nulla. Cras pellentesque neque eu sapien tempor, a porta justo sagittis. Donec libero est, malesuada efficitur erat sit amet, aliquam consectetur nibh. Nulla ultrices convallis viverra. Maecenas consequat sem molestie orci posuere, ac dignissim nisi varius. In tincidunt dui sit amet neque gravida mollis. Maecenas volutpat velit ex, vitae eleifend massa rutrum a. Sed elit nulla, mollis quis dictum ac, faucibus id augue.

> blockquote: Blockquote (`>`). Lorem ipsum dolor sit amet, consectetur adipiscing elit.
> Sed id ligula ac ligula vulputate luctus sit amet ac ante. Duis iaculis elit vel neque elementum molestie.
> Praesent eleifend lacinia tellus et bibendum. Vivamus lobortis diam sit amet libero tincidunt, nec consectetur enim tincidunt.
> Phasellus erat magna, sollicitudin sed eros ut, convallis commodo neque.

#### ul: Unordered List `-`

- li: List Item
- li: List Item
- li: List Item

#### ol: Ordered list `1.`

1. li: List Item
1. li: List Item
1. li: List Item

#### table: Table

| thead/tr/th: Table Head/Table Row/Table Header | th: Table Header | th: Table Header | th: Table Header |
| ---------------------------------------------- | ---------------- | ---------------- | ---------------- |
| tbody/tr/td: Table Body/Table Row/Table Cell   | td: Table Cell   | td: Table Cell   | td: Table Cell   |
| tr/td: Table Row/Table Cell                    | td: Table Cell   | td: Table Cell   | td: Table Cell   |
| tr/td: Table Row/Table Cell                    | td: Table Cell   | td: Table Cell   | td: Table Cell   |
| tr/td: Table Row/Table Cell                    | td: Table Cell   | td: Table Cell   | td: Table Cell   |
| tr/td: Table Row/Table Cell                    | td: Table Cell   | td: Table Cell   | td: Table Cell   |

#### Code Blocks

```
code: Code
pre: Code
```

```js
let code = 'JavaScript code';
```

```js
const longText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed id ligula ac ligula vulputate luctus sit amet ac ante. Duis iaculis elit vel neque elementum molestie. Praesent eleifend lacinia tellus et bibendum. Vivamus lobortis diam sit amet libero tincidunt, nec consectetur enim tincidunt. Phasellus erat magna, sollicitudin sed eros ut, convallis commodo neque. Morbi mattis sapien nulla. Cras pellentesque neque eu sapien tempor, a porta justo sagittis. Donec libero est, malesuada efficitur erat sit amet, aliquam consectetur nibh. Nulla ultrices convallis viverra. Maecenas consequat sem molestie orci posuere, ac dignissim nisi varius. In tincidunt dui sit amet neque gravida mollis. Maecenas volutpat velit ex, vitae eleifend massa rutrum a. Sed elit nulla, mollis quis dictum ac, faucibus id augue.';

const evenLongerText =
  'Fusce dapibus, eros nec dapibus maximus, metus nisl cursus enim, eget malesuada dui ante id libero. Nam porta enim a orci laoreet viverra. Proin quam enim, ullamcorper sed sem eget, volutpat faucibus ipsum. Ut iaculis eget leo et aliquet. Nunc fermentum bibendum dictum. Proin sagittis feugiat neque id volutpat. Nam in ullamcorper dolor, sed iaculis justo. Sed imperdiet erat ut nunc semper, ac maximus sapien varius. In vel pulvinar nisl, non tincidunt diam. Sed mattis ullamcorper enim quis faucibus. Phasellus eu rutrum nulla, eget volutpat nunc. Nam congue vestibulum orci, varius consequat mi facilisis id. Vivamus posuere urna tempus gravida malesuada. Cras non interdum eros. Vestibulum vel tortor velit. Aenean pretium, nulla sit amet congue lacinia, dolor quam porttitor enim, eget placerat magna risus at ex. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed semper tempus massa. Maecenas porta nisl odio, vel dapibus ex ultrices et. Morbi vitae nisl a nulla rutrum euismod. Vestibulum posuere commodo imperdiet.';
```

#### Inline Code

`inlineCode: Inline Code`

`js:::let code = 'Inline JavaScript code';`

#### Formatting

_em: Emphasis_ `_` `*`

**strong: Strong** `__` `**`

~~del: Delete/Strikethrough~~ `~~`

#### hr: Thematic break

`---` `***`

---

[a: Link](/markdown-kitchen-sink) `[text](link)`

#### img: Image

![kittens](/media/site-image.jpeg)

`![alt](link)`

#### Paragraph Containing All Inline Markdown

This is a paragraph with some _Emphasis_ text. It also contains **Strong** text, as well as ~~Strikethrough~~ text. Following that, we also have some plain text `Inline Code` as well as the code `js:::let code = 'Inline JavaScript code';`, which is highlighted as JavaScript!

#### Template Tags

Use template tags (see [README](https://github.com/justinmahar/gatsby-launchpad#template-tags) for list) in your markdown like so:

```md
<template text="{year}"></template>
```

Result: <template text="{year}"></template>

You can mix them with markdown, too: 

```md
##### <template text="{contentTitle}"></template>
```

##### Result: <template text="{contentTitle}"></template>

Pretty handy!

#### Gatsby Links

For internal navigation, Gatsby includes a built-in link component for creating links between internal pages. This uses a powerful performance feature called preloading to speed up page navigation.

```md
Blazing fast Gatsby Link: <gatsby-link to="/">Home 🔥</gatsby-link>
```

Blazing fast Gatsby Link: <gatsby-link to="/">Home 🔥</gatsby-link>

#### Custom Components

You can define additional custom components, allowing you to use components right in your markdown.

Custom components are defined in `MarkdownRenderer.tsx`. The template and gatsby link components above are both custom components.

For example, this custom component is defined as:

```ts
'custom-component': (props: any) => (
  <Button {...props} onClick={() => alert('Click!')}>
    {props.children}
  </Button>
```

> Note that all params are passed to the component from markdown as strings.

To use this in markdown: 

```md
<custom-component className="shadow">Click Me!</custom-component>
```

Here is the result:

<custom-component className="shadow">Click Me!</custom-component>
