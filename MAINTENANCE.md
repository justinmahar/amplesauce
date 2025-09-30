# Maintenance

This document contains information on how to maintain this project.

## Updating Dependencies

Use `ncu` to check which packages need to be upgraded.

#### `rehype-react`

As of 2/9/23, `rehype-react` v8 causes Markdown to fail due to type issues. Passes w/ v7. Need to look into how to use the latest API.

#### `remark-gfm`

As of 2/9/23, `remark-gfm` v4 causes the project to fail compilation. If you upgrade and compatibility had been fixed, feel free to remove this note.