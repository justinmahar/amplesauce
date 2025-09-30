import { Link, PageProps } from 'gatsby';
import * as React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Body from '../layout/Body';
import Layout from '../layout/Layout';
import Head from '../layout/Head';
import { TemplateText } from '../template-tags/TemplateText';
import { PageRoutes } from './PageRoutes';
import { SectionBackground } from '../sections/parts/SectionBackground';

export default function DefaultPrivacyPage(props: PageProps<any>): React.JSX.Element {
  const contentTitle = 'Privacy';
  const description = 'Privacy policy';

  return (
    <Layout>
      <Head contentTitle={contentTitle} seo={{ description }} />
      <Body>
        <SectionBackground first>
          <Container>
            <Row>
              <Col>
                <h1 className="mb-4">Privacy Policy</h1>
                <p>
                  At the <TemplateText text="{siteName}" /> website, one of our main priorities is the privacy of our
                  visitors. This Privacy Policy document contains types of information that is collected and recorded by{' '}
                  the <TemplateText text="{siteName}" /> website and how we use that information.
                </p>
                <h4>General Data Protection Regulation (GDPR)</h4>
                <p>We are a Data Controller of your information.</p>
                <p>
                  The <TemplateText text="{siteName}" /> website's legal basis for collecting and using the personal
                  information described in this Privacy Policy depends on the Personal Information we collect and the
                  specific context in which we collect the information:
                </p>
                <ul>
                  <li>
                    The <TemplateText text="{siteName}" /> website needs to perform a contract with you
                  </li>
                  <li>
                    You have given the <TemplateText text="{siteName}" /> website permission to do so
                  </li>
                  <li>
                    Processing your personal information is in the <TemplateText text="{siteName}" /> website's
                    legitimate interests
                  </li>
                  <li>
                    The <TemplateText text="{siteName}" /> website needs to comply with the law
                  </li>
                </ul>
                <p>
                  The <TemplateText text="{siteName}" /> website will retain your personal information only for as long
                  as is necessary for the purposes set out in this Privacy Policy. We will retain and use your
                  information to the extent necessary to comply with our legal obligations, resolve disputes, and
                  enforce our policies.
                </p>
                <p>
                  If you are a resident of the European Economic Area (EEA), you have certain data protection rights. If
                  you wish to be informed what Personal Information we hold about you and if you want it to be removed
                  from our systems, please contact us.
                </p>
                <p>In certain circumstances, you have the following data protection rights:</p>
                <ul>
                  <li>The right to access, update or to delete the information we have on you.</li>
                  <li>The right of rectification.</li>
                  <li>The right to object.</li>
                  <li>The right of restriction.</li>
                  <li>The right to data portability</li>
                  <li>The right to withdraw consent</li>
                </ul>
                <h4>Log Files</h4>
                <p>
                  The <TemplateText text="{siteName}" /> website follows a standard procedure of using log files. These
                  files log visitors when they visit websites. All hosting companies do this and a part of hosting
                  services' analytics. The information collected by log files include internet protocol (IP) addresses,
                  browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly
                  the number of clicks. These are not linked to any information that is personally identifiable. The
                  purpose of the information is for analyzing trends, administering the site, tracking users' movement
                  on the website, and gathering demographic information.
                </p>
                <h4>Cookies and Web Beacons</h4>
                <p>
                  Like any other website, the <TemplateText text="{siteName}" /> website uses 'cookies'. These cookies
                  are used to store information including visitors' preferences, and the pages on the website that the
                  visitor accessed or visited. The information is used to optimize the users' experience by customizing
                  our web page content based on visitors' browser type and/or other information.
                </p>
                <h4>Third Party Privacy Policies</h4>
                <p>
                  The <TemplateText text="{siteName}" /> website's Privacy Policy does not apply to other advertisers or
                  websites. Thus, where applicable, we are advising you to consult the respective Privacy Policies of
                  these third-party servers for more detailed information. It may include their practices and
                  instructions about how to opt-out of certain options.
                </p>
                <p>
                  Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that
                  are used in their respective advertisements and links that appear on the{' '}
                  <TemplateText text="{siteName}" /> website, which are sent directly to users' browser. They
                  automatically receive your IP address when this occurs. These technologies are used to measure the
                  effectiveness of their advertising campaigns and/or to personalize the advertising content that you
                  see on websites that you visit.
                </p>
                <p>
                  Note that the <TemplateText text="{siteName}" /> website has no access to or control over these
                  cookies that are used by third-party advertisers or websites.
                </p>
                <p>
                  You can choose to disable cookies through your individual browser options. To know more detailed
                  information about cookie management with specific web browsers, it can be found at the browsers'
                  respective websites.
                </p>
                <h4>Children's Information</h4>
                <p>
                  Another part of our priority is adding protection for children while using the internet. We encourage
                  parents and guardians to observe, participate in, and/or monitor and guide their online activity.
                </p>
                <p>
                  The <TemplateText text="{siteName}" /> website does not knowingly collect any Personal Identifiable
                  Information from children under the age of 13. If you think that your child provided this kind of
                  information on the <TemplateText text="{siteName}" /> website, we strongly encourage you to contact us
                  immediately and we will do our best efforts to promptly remove such information from our records.
                </p>
                <h4>Online Privacy Policy Only</h4>
                <p>
                  Our Privacy Policy applies only to our online activities and is valid for visitors with regards to the
                  information that they shared and/or collected from the <TemplateText text="{siteName}" /> website.
                  This policy is not applicable to any information collected offline or via channels other than the{' '}
                  <TemplateText text="{siteName}" /> website.
                </p>
                <h4>Consent</h4>
                <p>
                  By using the <TemplateText text="{siteName}" /> website, you hereby consent to the Privacy Policy and
                  agree to its <Link to={PageRoutes.terms}>Terms</Link>.
                </p>
              </Col>
            </Row>
          </Container>
        </SectionBackground>
      </Body>
    </Layout>
  );
}
