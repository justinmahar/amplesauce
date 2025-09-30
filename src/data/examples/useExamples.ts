import { graphql, useStaticQuery } from 'gatsby';
import { useEditor } from '../../components/editor/useEditor';

export const examplesQuery = graphql`
  query ExamplesQuery {
    allExamplesYaml {
      nodes {
        name
        value
      }
    }
  }
`;
// ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑
// Important: The shapes of the query above and the type below must match!
// ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
export type ExamplesData = {
  allExamplesYaml: {
    nodes: Example[];
  };
};

export interface Example {
  name: string;
  value: number;
}

// === === === === === === === === ===

export default class Examples {
  constructor(public data: ExamplesData) {}
}

export const useExamples = (): Examples => {
  const data = useStaticQuery(examplesQuery);
  return new Examples(data);
};

export const useExampleEditor = () => {
  return useEditor<Example>({
    // scrubItem: (item) => {
    //   delete item['fields'];
    //   return item;
    // },
  });
};
