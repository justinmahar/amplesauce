import classNames from 'classnames';
import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { DefaultGFormsContactCard } from '../contact/DefaultGFormsContactCard';
import { useSiteSettingsContext } from '../contexts/SiteSettingsProvider';
import { TemplateText } from '../template-tags/TemplateText';
import { SectionBackground, SectionBackgroundProps } from './parts/SectionBackground';

export interface BasicContactSectionProps extends SectionBackgroundProps {}

export const BasicContactSection = ({ ...props }: BasicContactSectionProps) => {
  const siteSettings = useSiteSettingsContext();
  if (siteSettings) {
    const formAction = siteSettings.data.settingsYaml.googleFormContact.formAction;
    const subjectName = siteSettings.data.settingsYaml.googleFormContact.subjectName;
    const messageName = siteSettings.data.settingsYaml.googleFormContact.messageName;
    const originName = siteSettings.data.settingsYaml.googleFormContact.originName;
    return (
      <SectionBackground
        src="/media/pages/contact.webp"
        bgStyle={{ opacity: 0.3 }}
        spacing={{ xs: 40, lg: 80 }}
        themedText
        {...props}
        className={classNames(props.className)}
        style={{
          ...props.style,
        }}
      >
        <Container>
          <Row>
            <Col lg={{ offset: 3, span: 6 }}>
              <Card className="shadow">
                <Card.Header className="py-3">
                  <h3 className="mb-0">Contact</h3>
                </Card.Header>
                <Card.Body>
                  <p>
                    You can contact <TemplateText text="{siteName}" /> by filling out the form below.
                  </p>
                  <DefaultGFormsContactCard
                    formAction={formAction}
                    subjectName={subjectName}
                    messageName={messageName}
                    originName={originName}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </SectionBackground>
    );
  }

  return <></>;
};
