import React, { JSX } from 'react';
import Footer from './Footer';
import Header from './Header';

export interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout(props: LayoutProps): JSX.Element {
  // Note: Enabling password protection disables all metadata scraping
  // const PasswordProtection = usePasswordProtection();
  // if (PasswordProtection.accessGranted) {
  return (
    <>
      <Header />
      {props.children}
      <Footer />
    </>
  );
  // }
  // return <PasswordProtection.Redirection />;
}
