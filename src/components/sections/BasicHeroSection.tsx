import classNames from 'classnames';
import React from 'react';
import { Button, Col, Container, Image, Row } from 'react-bootstrap';
import { SectionBackground, SectionBackgroundProps } from './parts/SectionBackground';
import { useThemeContext } from '../contexts/ThemeProvider';
import { Gradients } from '../misc/Gradients';

export interface BasicHeroSectionProps extends SectionBackgroundProps {}

export const BasicHeroSection = ({ ...props }: BasicHeroSectionProps) => {
  const theme = useThemeContext();
  const darkModeGradientStyles = Gradients.cssToStyleProps(
    'background-image: radial-gradient(circle at 17% 77%, rgba(17, 17, 17,0.04) 0%, rgba(17, 17, 17,0.04) 50%,rgba(197, 197, 197,0.04) 50%, rgba(197, 197, 197,0.04) 100%),radial-gradient(circle at 26% 17%, rgba(64, 64, 64,0.04) 0%, rgba(64, 64, 64,0.04) 50%,rgba(244, 244, 244,0.04) 50%, rgba(244, 244, 244,0.04) 100%),radial-gradient(circle at 44% 60%, rgba(177, 177, 177,0.04) 0%, rgba(177, 177, 177,0.04) 50%,rgba(187, 187, 187,0.04) 50%, rgba(187, 187, 187,0.04) 100%),linear-gradient(19deg, rgb(28, 117, 250),rgb(34, 2, 159));',
  );
  const lightModeGradientStyles = Gradients.cssToStyleProps(
    'background-image: radial-gradient(circle at 85% 1%, hsla(190,0%,93%,0.05) 0%, hsla(190,0%,93%,0.05) 96%,transparent 96%, transparent 100%),radial-gradient(circle at 14% 15%, hsla(190,0%,93%,0.05) 0%, hsla(190,0%,93%,0.05) 1%,transparent 1%, transparent 100%),radial-gradient(circle at 60% 90%, hsla(190,0%,93%,0.05) 0%, hsla(190,0%,93%,0.05) 20%,transparent 20%, transparent 100%),radial-gradient(circle at 79% 7%, hsla(190,0%,93%,0.05) 0%, hsla(190,0%,93%,0.05) 78%,transparent 78%, transparent 100%),radial-gradient(circle at 55% 65%, hsla(190,0%,93%,0.05) 0%, hsla(190,0%,93%,0.05) 52%,transparent 52%, transparent 100%),linear-gradient(135deg, rgb(37, 56, 222),rgb(96, 189, 244));',
  );
  const gradientStyles = theme.darkModeEnabled ? darkModeGradientStyles : lightModeGradientStyles;
  return (
    <SectionBackground
      spacing={{ xs: 40, lg: 120 }}
      gradientStyles={gradientStyles}
      noise
      {...props}
      className={classNames('text-white', props.className)}
      style={{
        ...props.style,
      }}
    >
      <Container>
        <Row>
          <Col className="d-flex align-items-center p-4">
            <div>
              <h1>Welcome to Gatsby Launchpad! 👋</h1>
              <p>
                This is a progressive web app (PWA) starter project that gets you up and running blazing fast. You can
                reuse the sections on this page and customize them to fit your needs.
              </p>
              <p>
                This starter can easily be deployed to Netlify and is highly configurable. Follow the README for setup
                instructions and happy building!
              </p>
              <div className="d-flex gap-3">
                <Button size="lg" variant="warning" onClick={() => console.log('Primary')}>
                  About
                </Button>
                <Button size="lg" variant="warning" onClick={() => console.log('Primary')}>
                  Contact
                </Button>
              </div>
            </div>
          </Col>
          <Col className="d-flex align-items-center justify-content-center p-4">
            <Image
              src="/media/gatsby.webp"
              className="w-100 shadow"
              style={{ minWidth: 300, maxWidth: 400, borderRadius: 20 }}
            />
          </Col>
        </Row>
      </Container>
    </SectionBackground>
  );
};
