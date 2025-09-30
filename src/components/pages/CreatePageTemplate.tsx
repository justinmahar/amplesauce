import { PageProps } from 'gatsby';
import React, { JSX } from 'react';
import { Example } from '../../data/examples/useExamples';
import DefaultTemplatePage from './DefaultTemplatePage';

// TODO: Put page route in PageRoutes, i.e. PageRoutes.examples

export default function CreatePageTemplate(props: PageProps<{ examplesYaml: Example }>): JSX.Element {
  // Access the example data here
  // const example = props.data.examplesYaml;
  // console.log(example.name);
  return <DefaultTemplatePage {...props} />;
}

// Page query is located in js folder, in file of same name
