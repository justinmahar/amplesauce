import { Link, PageProps } from 'gatsby';
import * as React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Body from '../layout/Body';
import Layout from '../layout/Layout';
import { PageRoutes } from './PageRoutes';
import Head from '../layout/Head';
import { TemplateText } from '../template-tags/TemplateText';
import { SectionBackground } from '../sections/parts/SectionBackground';

export default function DefaultTermsPage(props: PageProps<any>): React.JSX.Element {
  const contentTitle = 'Terms of Service';
  const description = 'To use this site, you must agree to these terms of service';

  return (
    <Layout>
      <Head contentTitle={contentTitle} seo={{ description }} />
      <Body>
        <SectionBackground first>
          <Container>
            <Row>
              <Col>
                <h1 className="mb-4">Terms of Service</h1>
                <div className="font-monospace">
                  <h4>1. Terms</h4>
                  <p>
                    By accessing the <TemplateText text="{siteName}" /> website, you are agreeing to be bound by these
                    Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable
                    local laws. If you disagree with any of these terms, you are prohibited from accessing this site.
                    The materials contained in the <TemplateText text="{siteName}" /> website are protected by copyright
                    and trade mark law.
                  </p>
                  <h4>2. Use License</h4>
                  <p>
                    Permission is granted to temporarily download one copy of the materials on the{' '}
                    <TemplateText text="{siteName}" /> website for personal, non-commercial transitory viewing only.
                    This is the grant of a license, not a transfer of title, and under this license you may not:
                  </p>
                  <ul>
                    <li>modify or copy the materials;</li>
                    <li>use the materials for any commercial purpose or for any public display;</li>
                    <li>
                      attempt to reverse engineer any software contained on the <TemplateText text="{siteName}" />{' '}
                      website;
                    </li>
                    <li>remove any copyright or other proprietary notations from the materials; or</li>
                    <li>transferring the materials to another person or "mirror" the materials on any other server.</li>
                  </ul>
                  <p>
                    This will allow the <TemplateText text="{siteName}" /> website to terminate this license upon
                    violations of any of these restrictions. Upon termination, your viewing right will also be
                    terminated and you should destroy any downloaded materials in your possession whether it is in
                    printed or electronic format.
                  </p>
                  <h4>3. Disclaimer</h4>
                  <p>
                    All the materials on the <TemplateText text="{siteName}" /> website are provided "as is". The{' '}
                    <TemplateText text="{siteName}" /> website makes no warranties, may it be expressed or implied,
                    therefore negates all other warranties. Furthermore, the <TemplateText text="{siteName}" /> website
                    does not make any representations concerning the accuracy or reliability of the use of the materials
                    on the <TemplateText text="{siteName}" /> website or otherwise relating to such materials or any
                    sites linked to the <TemplateText text="{siteName}" /> website.
                  </p>
                  <h4>4. Limitations</h4>
                  <p>
                    The <TemplateText text="{siteName}" /> website or its suppliers will not be held accountable for any
                    damages that will arise with the use or inability to use the materials on the{' '}
                    <TemplateText text="{siteName}" /> website , even if the <TemplateText text="{siteName}" /> website
                    or an authorizes representative of the <TemplateText text="{siteName}" /> website has been notified,
                    orally or written, of the possibility of such damage. Some jurisdiction does not allow limitations
                    on implied warranties or limitations of liability for incidental damages, these limitations may not
                    apply to you.
                  </p>
                  <h4>5. Revisions and Errata</h4>
                  <p>
                    The materials appearing on the <TemplateText text="{siteName}" /> website may include technical,
                    typographical, or photographic errors. The <TemplateText text="{siteName}" /> website will not
                    promise that any of the materials in the <TemplateText text="{siteName}" /> website are accurate,
                    complete, or current. The <TemplateText text="{siteName}" /> website may change the materials
                    contained on the <TemplateText text="{siteName}" /> website at any time without notice. The{' '}
                    <TemplateText text="{siteName}" /> website does not make any commitment to update the materials.
                  </p>
                  <h4>6. Links</h4>
                  <p>
                    The <TemplateText text="{siteName}" /> website has not reviewed all of the sites linked to the{' '}
                    <TemplateText text="{siteName}" /> website and is not responsible for the contents of any such
                    linked site. The presence of any link does not imply endorsement by the{' '}
                    <TemplateText text="{siteName}" /> website of the site. The use of any linked website is at the
                    user’s own risk.
                  </p>
                  <h4>7. Site Terms of Use Modifications</h4>
                  <p>
                    The <TemplateText text="{siteName}" /> website may revise these Terms of Use for the{' '}
                    <TemplateText text="{siteName}" /> website at any time without prior notice. By using the{' '}
                    <TemplateText text="{siteName}" /> website, you are agreeing to be bound by the current version of
                    these Terms and Conditions of Use.
                  </p>
                  <h4>8. Your Privacy</h4>
                  <p>
                    Please read our <Link to={PageRoutes.privacy}>Privacy Policy</Link>.
                  </p>
                  <h4>9. Governing Law</h4>
                  <p>
                    Any claim related to the <TemplateText text="{siteName}" /> website shall be governed by the laws of
                    us without regards to its conflict of law provisions.
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </SectionBackground>
      </Body>
    </Layout>
  );
}
