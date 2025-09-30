import { PageProps } from 'gatsby';
import React, { JSX } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Body from '../components/layout/Body';
import Layout from '../components/layout/Layout';
import Head from '../components/layout/Head';
import DefaultTemplatePage from '../components/pages/DefaultTemplatePage';

// TODO: Put page route in PageRoutes, i.e. PageRoutes.template

export default function Template(props: PageProps<any>): JSX.Element {
  return <DefaultTemplatePage {...props} />;
}

// Page query goes here
