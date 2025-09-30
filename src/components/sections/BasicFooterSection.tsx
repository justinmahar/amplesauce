import classNames from 'classnames';
import React from 'react';
import { DivProps } from 'react-html-props';
import { SectionBackground } from './parts/SectionBackground';
import { Container, Row, Col, Nav, Stack } from 'react-bootstrap';
import { useThemeContext } from '../contexts/ThemeProvider';
import { useSiteSettingsContext } from '../contexts/SiteSettingsProvider';
import { useUserSettingsContext } from '../contexts/UserSettingsProvider';
import { useShowAdmin } from '../hooks/useShowAdmin';
import { useUser } from '../contexts/UserAccountProvider';
import { Link } from 'gatsby-link';
import { PageRoutes } from '../pages/PageRoutes';
import { FIRESTORE_EMULATOR_ENABLED, hasFirebaseConfig } from '../firebase/firebase-app';
import { BuildStatusBadge } from 'react-build-status-badge';
import { FaFire } from 'react-icons/fa';
import { Gradients } from '../misc/Gradients';
import { LogoutModal } from '../auth/LogoutModal';
import { scrollToTopTimeout } from '../markdown/scrollToTopTimeout';

export interface BasicFooterSectionProps extends DivProps {
  first?: boolean;
}

export const BasicFooterSection = ({ ...props }: BasicFooterSectionProps) => {
  const theme = useThemeContext();
  const siteSettings = useSiteSettingsContext();
  const userSettingsLoader = useUserSettingsContext();
  const userSettings = userSettingsLoader.userSettings;
  const templateTagRenderer = siteSettings?.getTemplateTagRenderer();
  const showAdmin = useShowAdmin();
  const user = useUser();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const textColorClass = theme.darkModeEnabled ? 'text-white' : 'text-black';
  const darkModeGradientStyles = Gradients.cssToStyleProps(
    'background-image: linear-gradient(200deg, rgba(213, 213, 213, 0.01) 0%, rgba(213, 213, 213, 0.01) 14.286%,rgba(140, 140, 140, 0.01) 14.286%, rgba(140, 140, 140, 0.01) 28.572%,rgba(52, 52, 52, 0.01) 28.572%, rgba(52, 52, 52, 0.01) 42.858%,rgba(38, 38, 38, 0.01) 42.858%, rgba(38, 38, 38, 0.01) 57.144%,rgba(159, 159, 159, 0.01) 57.144%, rgba(159, 159, 159, 0.01) 71.42999999999999%,rgba(71, 71, 71, 0.01) 71.43%, rgba(71, 71, 71, 0.01) 85.71600000000001%,rgba(88, 88, 88, 0.01) 85.716%, rgba(88, 88, 88, 0.01) 100.002%),linear-gradient(337deg, rgba(25, 25, 25, 0.01) 0%, rgba(25, 25, 25, 0.01) 12.5%,rgba(150, 150, 150, 0.01) 12.5%, rgba(150, 150, 150, 0.01) 25%,rgba(84, 84, 84, 0.01) 25%, rgba(84, 84, 84, 0.01) 37.5%,rgba(85, 85, 85, 0.01) 37.5%, rgba(85, 85, 85, 0.01) 50%,rgba(188, 188, 188, 0.01) 50%, rgba(188, 188, 188, 0.01) 62.5%,rgba(80, 80, 80, 0.01) 62.5%, rgba(80, 80, 80, 0.01) 75%,rgba(73, 73, 73, 0.01) 75%, rgba(73, 73, 73, 0.01) 87.5%,rgba(219, 219, 219, 0.01) 87.5%, rgba(219, 219, 219, 0.01) 100%),linear-gradient(203deg, rgba(233, 233, 233, 0.01) 0%, rgba(233, 233, 233, 0.01) 25%,rgba(114, 114, 114, 0.01) 25%, rgba(114, 114, 114, 0.01) 50%,rgba(164, 164, 164, 0.01) 50%, rgba(164, 164, 164, 0.01) 75%,rgba(228, 228, 228, 0.01) 75%, rgba(228, 228, 228, 0.01) 100%),linear-gradient(317deg, rgba(139, 139, 139, 0.02) 0%, rgba(139, 139, 139, 0.02) 16.667%,rgba(44, 44, 44, 0.02) 16.667%, rgba(44, 44, 44, 0.02) 33.334%,rgba(166, 166, 166, 0.02) 33.334%, rgba(166, 166, 166, 0.02) 50.001000000000005%,rgba(2, 2, 2, 0.02) 50.001%, rgba(2, 2, 2, 0.02) 66.668%,rgba(23, 23, 23, 0.02) 66.668%, rgba(23, 23, 23, 0.02) 83.33500000000001%,rgba(21, 21, 21, 0.02) 83.335%, rgba(21, 21, 21, 0.02) 100.002%),linear-gradient(328deg, rgba(3, 3, 3, 0.03) 0%, rgba(3, 3, 3, 0.03) 12.5%,rgba(116, 116, 116, 0.03) 12.5%, rgba(116, 116, 116, 0.03) 25%,rgba(214, 214, 214, 0.03) 25%, rgba(214, 214, 214, 0.03) 37.5%,rgba(217, 217, 217, 0.03) 37.5%, rgba(217, 217, 217, 0.03) 50%,rgba(68, 68, 68, 0.03) 50%, rgba(68, 68, 68, 0.03) 62.5%,rgba(118, 118, 118, 0.03) 62.5%, rgba(118, 118, 118, 0.03) 75%,rgba(200, 200, 200, 0.03) 75%, rgba(200, 200, 200, 0.03) 87.5%,rgba(198, 198, 198, 0.03) 87.5%, rgba(198, 198, 198, 0.03) 100%),linear-gradient(97deg, rgba(195, 195, 195, 0.03) 0%, rgba(195, 195, 195, 0.03) 16.667%,rgba(177, 177, 177, 0.03) 16.667%, rgba(177, 177, 177, 0.03) 33.334%,rgba(170, 170, 170, 0.03) 33.334%, rgba(170, 170, 170, 0.03) 50.001000000000005%,rgba(158, 158, 158, 0.03) 50.001%, rgba(158, 158, 158, 0.03) 66.668%,rgba(121, 121, 121, 0.03) 66.668%, rgba(121, 121, 121, 0.03) 83.33500000000001%,rgba(146, 146, 146, 0.03) 83.335%, rgba(146, 146, 146, 0.03) 100.002%),linear-gradient(268deg, rgba(103, 103, 103, 0.03) 0%, rgba(103, 103, 103, 0.03) 25%,rgba(112, 112, 112, 0.03) 25%, rgba(112, 112, 112, 0.03) 50%,rgba(4, 4, 4, 0.03) 50%, rgba(4, 4, 4, 0.03) 75%,rgba(227, 227, 227, 0.03) 75%, rgba(227, 227, 227, 0.03) 100%),linear-gradient(90deg, hsl(98,0%,0%),hsl(98,0%,0%))',
  );
  const lightModeGradientStyles = Gradients.cssToStyleProps(
    'background-image: linear-gradient(55deg, rgba(208, 208, 208, 0.03) 0%, rgba(208, 208, 208, 0.03) 20%,rgba(55, 55, 55, 0.03) 20%, rgba(55, 55, 55, 0.03) 40%,rgba(81, 81, 81, 0.03) 40%, rgba(81, 81, 81, 0.03) 60%,rgba(208, 208, 208, 0.03) 60%, rgba(208, 208, 208, 0.03) 80%,rgba(191, 191, 191, 0.03) 80%, rgba(191, 191, 191, 0.03) 100%),linear-gradient(291deg, rgba(190, 190, 190, 0.02) 0%, rgba(190, 190, 190, 0.02) 14.286%,rgba(105, 105, 105, 0.02) 14.286%, rgba(105, 105, 105, 0.02) 28.572%,rgba(230, 230, 230, 0.02) 28.572%, rgba(230, 230, 230, 0.02) 42.858%,rgba(216, 216, 216, 0.02) 42.858%, rgba(216, 216, 216, 0.02) 57.144%,rgba(181, 181, 181, 0.02) 57.144%, rgba(181, 181, 181, 0.02) 71.42999999999999%,rgba(129, 129, 129, 0.02) 71.43%, rgba(129, 129, 129, 0.02) 85.71600000000001%,rgba(75, 75, 75, 0.02) 85.716%, rgba(75, 75, 75, 0.02) 100.002%),linear-gradient(32deg, rgba(212, 212, 212, 0.03) 0%, rgba(212, 212, 212, 0.03) 12.5%,rgba(223, 223, 223, 0.03) 12.5%, rgba(223, 223, 223, 0.03) 25%,rgba(11, 11, 11, 0.03) 25%, rgba(11, 11, 11, 0.03) 37.5%,rgba(86, 86, 86, 0.03) 37.5%, rgba(86, 86, 86, 0.03) 50%,rgba(106, 106, 106, 0.03) 50%, rgba(106, 106, 106, 0.03) 62.5%,rgba(220, 220, 220, 0.03) 62.5%, rgba(220, 220, 220, 0.03) 75%,rgba(91, 91, 91, 0.03) 75%, rgba(91, 91, 91, 0.03) 87.5%,rgba(216, 216, 216, 0.03) 87.5%, rgba(216, 216, 216, 0.03) 100%),linear-gradient(312deg, rgba(113, 113, 113, 0.01) 0%, rgba(113, 113, 113, 0.01) 14.286%,rgba(54, 54, 54, 0.01) 14.286%, rgba(54, 54, 54, 0.01) 28.572%,rgba(166, 166, 166, 0.01) 28.572%, rgba(166, 166, 166, 0.01) 42.858%,rgba(226, 226, 226, 0.01) 42.858%, rgba(226, 226, 226, 0.01) 57.144%,rgba(109, 109, 109, 0.01) 57.144%, rgba(109, 109, 109, 0.01) 71.42999999999999%,rgba(239, 239, 239, 0.01) 71.43%, rgba(239, 239, 239, 0.01) 85.71600000000001%,rgba(54, 54, 54, 0.01) 85.716%, rgba(54, 54, 54, 0.01) 100.002%),linear-gradient(22deg, rgba(77, 77, 77, 0.03) 0%, rgba(77, 77, 77, 0.03) 20%,rgba(235, 235, 235, 0.03) 20%, rgba(235, 235, 235, 0.03) 40%,rgba(215, 215, 215, 0.03) 40%, rgba(215, 215, 215, 0.03) 60%,rgba(181, 181, 181, 0.03) 60%, rgba(181, 181, 181, 0.03) 80%,rgba(193, 193, 193, 0.03) 80%, rgba(193, 193, 193, 0.03) 100%),linear-gradient(80deg, rgba(139, 139, 139, 0.02) 0%, rgba(139, 139, 139, 0.02) 14.286%,rgba(114, 114, 114, 0.02) 14.286%, rgba(114, 114, 114, 0.02) 28.572%,rgba(240, 240, 240, 0.02) 28.572%, rgba(240, 240, 240, 0.02) 42.858%,rgba(221, 221, 221, 0.02) 42.858%, rgba(221, 221, 221, 0.02) 57.144%,rgba(74, 74, 74, 0.02) 57.144%, rgba(74, 74, 74, 0.02) 71.42999999999999%,rgba(201, 201, 201, 0.02) 71.43%, rgba(201, 201, 201, 0.02) 85.71600000000001%,rgba(187, 187, 187, 0.02) 85.716%, rgba(187, 187, 187, 0.02) 100.002%),linear-gradient(257deg, rgba(72, 72, 72, 0.03) 0%, rgba(72, 72, 72, 0.03) 16.667%,rgba(138, 138, 138, 0.03) 16.667%, rgba(138, 138, 138, 0.03) 33.334%,rgba(54, 54, 54, 0.03) 33.334%, rgba(54, 54, 54, 0.03) 50.001000000000005%,rgba(161, 161, 161, 0.03) 50.001%, rgba(161, 161, 161, 0.03) 66.668%,rgba(17, 17, 17, 0.03) 66.668%, rgba(17, 17, 17, 0.03) 83.33500000000001%,rgba(230, 230, 230, 0.03) 83.335%, rgba(230, 230, 230, 0.03) 100.002%),linear-gradient(47deg, rgba(191, 191, 191, 0.01) 0%, rgba(191, 191, 191, 0.01) 16.667%,rgba(27, 27, 27, 0.01) 16.667%, rgba(27, 27, 27, 0.01) 33.334%,rgba(66, 66, 66, 0.01) 33.334%, rgba(66, 66, 66, 0.01) 50.001000000000005%,rgba(36, 36, 36, 0.01) 50.001%, rgba(36, 36, 36, 0.01) 66.668%,rgba(230, 230, 230, 0.01) 66.668%, rgba(230, 230, 230, 0.01) 83.33500000000001%,rgba(93, 93, 93, 0.01) 83.335%, rgba(93, 93, 93, 0.01) 100.002%),linear-gradient(90deg, #ffffff,#ffffff);',
  );
  const gradientStyles = theme.darkModeEnabled ? darkModeGradientStyles : lightModeGradientStyles;

  return (
    <SectionBackground
      gradientStyles={gradientStyles}
      {...props}
      className={classNames('border-top', theme.darkModeEnabled ? 'border-black' : 'border-light', props.className)}
      style={{ ...props.style }}
    >
      <LogoutModal show={showLogoutModal} setShow={setShowLogoutModal} />
      <Container>
        <Row>
          <Col>
            <div className="d-flex flex-column justify-content-center">
              <div className={classNames(textColorClass, 'text-center mt-6 mb-4')}>
                {templateTagRenderer?.render('{siteName}')} &middot; Copyright &copy;{' '}
                {templateTagRenderer?.render('{year}')}
              </div>
              <div className="d-flex flex-wrap justify-content-center">
                <Nav>
                  <Link
                    className={classNames(textColorClass, 'nav-link fw-bold text-decoration-none text-center')}
                    role="button"
                    to={PageRoutes.terms}
                    onClick={scrollToTopTimeout}
                  >
                    Terms
                  </Link>
                </Nav>
                <Nav>
                  <Link
                    className={classNames(textColorClass, 'nav-link fw-bold text-decoration-none text-center')}
                    role="button"
                    to={PageRoutes.privacy}
                    onClick={scrollToTopTimeout}
                  >
                    Privacy
                  </Link>
                </Nav>
                {FIRESTORE_EMULATOR_ENABLED &&
                  siteSettings?.data.site.siteMetadata.siteEnvironment === 'development' && (
                    <Nav>
                      <a
                        className={classNames(textColorClass, 'nav-link fw-bold text-decoration-none text-center')}
                        role="button"
                        href="http://localhost:4000/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Stack direction="horizontal" gap={2}>
                          <FaFire className="text-warning" /> Firebase Emulator Suite
                        </Stack>
                      </a>
                    </Nav>
                  )}
                {!FIRESTORE_EMULATOR_ENABLED &&
                  siteSettings?.data.site.siteMetadata.siteEnvironment === 'development' && (
                    <Nav>
                      <a
                        className={classNames(textColorClass, 'nav-link fw-bold text-decoration-none text-center')}
                        role="button"
                        href="https://console.firebase.google.com/u/0/project/ample-sauce/overview"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Stack direction="horizontal" gap={2}>
                          <FaFire className="text-warning" /> Firebase Console
                        </Stack>
                      </a>
                    </Nav>
                  )}
                {!user && hasFirebaseConfig && (
                  <Nav>
                    <Link
                      className={classNames(textColorClass, 'nav-link fw-bold text-decoration-none text-center')}
                      role="button"
                      to={PageRoutes.login}
                      onClick={scrollToTopTimeout}
                    >
                      Login
                    </Link>
                  </Nav>
                )}
                {user && (
                  <Nav>
                    <Link
                      className={classNames(textColorClass, 'nav-link fw-bold text-decoration-none text-center')}
                      role="button"
                      to={PageRoutes.logout}
                      onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                        e.preventDefault();
                        setShowLogoutModal(true);
                      }}
                    >
                      Logout
                    </Link>
                  </Nav>
                )}
                {userSettings?.isAdmin() && (
                  <Nav>
                    <Link
                      className={classNames(textColorClass, 'nav-link fw-bold text-decoration-none text-center')}
                      role="button"
                      to={PageRoutes.admin}
                      onClick={scrollToTopTimeout}
                    >
                      Admin
                    </Link>
                  </Nav>
                )}
                {showAdmin && (
                  <Nav>
                    <div className="nav-link" role="button">
                      <BuildStatusBadge>{siteSettings?.data.settingsYaml.netlifyBadgeMarkdown}</BuildStatusBadge>
                    </div>
                  </Nav>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </SectionBackground>
  );
};
