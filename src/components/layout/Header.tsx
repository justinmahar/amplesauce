import classNames from 'classnames';
import { Link } from 'gatsby';
import React, { JSX } from 'react';
import { Container, Image, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import { Subs } from 'react-sub-unsub';
import { useLocalSettingsContext } from '../contexts/LocalSettingsProvider';
import { useSiteSettingsContext } from '../contexts/SiteSettingsProvider';
import { useUser } from '../contexts/UserAccountProvider';
import { useUserSettingsContext } from '../contexts/UserSettingsProvider';
import { hasFirebaseConfig } from '../firebase/firebase-app';
import { createGravatarUrl } from '../misc/gravatar';
import { useThemeContext } from '../contexts/ThemeProvider';
import { PageRoutes } from '../pages/PageRoutes';
import { LocalSettingsKeys } from '../settings/LocalSettings';
import { ThemeBadge } from '../misc/ThemeBadge';

export interface HeaderProps {}

export default function Header(_props: HeaderProps): JSX.Element {
  const siteSettings = useSiteSettingsContext();
  const headerHeight = siteSettings?.data.settingsYaml.headerHeight ?? 80;
  const user = useUser();
  const userSettingsLoader = useUserSettingsContext();
  const userSettings = userSettingsLoader.userSettings;
  const theme = useThemeContext();
  const localSettings = useLocalSettingsContext();
  const [darkModeEnabled, setDarkModeEnabled] = localSettings[LocalSettingsKeys.darkModeEnabledState];
  const [lastScrollY, setLastScrollY] = React.useState(Number.NEGATIVE_INFINITY);
  const [scrollZone, setScrollZone] = React.useState('none');
  // const [scrollDirection, setScrollDirection] = React.useState('none');
  const [scrollThresholdPassed, setScrollThresholdPassed] = React.useState(false);

  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  const email = user?.email || 'Error retrieving email';
  const avatarUrl = createGravatarUrl(email);

  const fadeDelayMillis = 300;
  const [shouldHide, setShouldHide] = React.useState(false);
  React.useEffect(() => {
    if (scrollThresholdPassed && scrollZone === 'body') {
      setTimeout(() => setShouldHide(true), fadeDelayMillis);
    } else {
      setShouldHide(false);
    }
  }, [scrollThresholdPassed, scrollZone]);

  /** Configure at which Bootstrap responsive size the menu expands. Will collapse at sizes smaller than this. */
  const expand = 'md';

  const textColorClass = theme.darkModeEnabled ? 'text-white' : 'text-black';

  React.useEffect(() => {
    setLastScrollY(window.scrollY);
    const subs = new Subs();
    subs.subscribeDOMEvent(window, 'scroll', (event) => {
      setLastScrollY(window.scrollY);
      // setScrollDirection(window.scrollY > lastScrollY ? 'down' : 'up');
    });
    return subs.createCleanup();
  }, [lastScrollY]);

  React.useEffect(() => {
    if (lastScrollY !== Number.NEGATIVE_INFINITY && lastScrollY > 20) {
      setScrollZone('body');
      if (scrollZone === 'header') {
        setScrollThresholdPassed(true);
      }
    } else if (lastScrollY !== Number.NEGATIVE_INFINITY && lastScrollY < 20) {
      setScrollZone('header');
      if (scrollZone === 'body') {
        setScrollThresholdPassed(true);
      }
    }
  }, [lastScrollY, scrollThresholdPassed, scrollZone]);

  const navElements = (
    <>
      <Nav>
        <Link
          to={PageRoutes.index}
          className={classNames('nav-link popIn', pathname === PageRoutes.index && 'fw-bold', textColorClass)}
          role="button"
        >
          Home
        </Link>
      </Nav>
      {userSettings?.isAdmin() && (
        <Nav>
          <Link
            to={PageRoutes.admin}
            className={classNames('nav-link popIn', pathname.startsWith(PageRoutes.admin) && 'fw-bold', textColorClass)}
            role="button"
          >
            Admin
          </Link>
        </Nav>
      )}
      <Nav>
        <Link
          to={PageRoutes.about}
          className={classNames('nav-link popIn', pathname.startsWith(PageRoutes.about) && 'fw-bold', textColorClass)}
          role="button"
        >
          About
        </Link>
      </Nav>
      <Nav>
        <Link
          to={PageRoutes.contact}
          className={classNames('nav-link popIn', pathname.startsWith(PageRoutes.contact) && 'fw-bold', textColorClass)}
          role="button"
        >
          Contact
        </Link>
      </Nav>
      {!user && hasFirebaseConfig && (
        <Nav key="login-nav">
          <Link
            to={PageRoutes.login}
            className={classNames('nav-link popIn', pathname.startsWith(PageRoutes.login) && 'fw-bold', textColorClass)}
            role="button"
          >
            Login
          </Link>
        </Nav>
      )}
      {user && (
        <Nav key="profile-small-device-nav" className={`d-${expand}-none`}>
          <Link
            to={PageRoutes.profile}
            role="button"
            className={classNames(
              'nav-link d-flex align-items-center gap-1',
              pathname.startsWith(PageRoutes.profile) && 'fw-bold',
              textColorClass,
            )}
          >
            <Image src={avatarUrl} roundedCircle width={16} height={16} />
            <span className={`d-${expand}-none`}>Profile</span>
          </Link>
        </Nav>
      )}
      {user && (
        <Nav key="profile-large-device-nav" className={classNames(`d-none d-${expand}-flex align-items-center`)}>
          <Link
            to={PageRoutes.profile}
            className={classNames(
              'nav-link popIn',
              pathname.startsWith(PageRoutes.profile) && 'fw-bold',
              textColorClass,
            )}
            role="button"
          >
            <div className="d-flex align-items-center gap-2">
              <Image src={avatarUrl} roundedCircle width={30} height={30} />
              <div>Profile</div>
            </div>
          </Link>
        </Nav>
      )}
      <Nav className={`d-none d-${expand}-flex popIn`}>
        <div className={`d-flex mx-${expand}-3`}>
          <ThemeBadge />
        </div>
      </Nav>
      <hr className={`d-${expand}none`} />
      <div className={`d-flex justify-content-end d-${expand}-none`}>
        <ThemeBadge size={30} />
      </div>
    </>
  );

  if (shouldHide) {
    return <></>;
  }
  return (
    <Navbar
      fixed="top"
      expand={expand}
      className={classNames(
        (lastScrollY === Number.NEGATIVE_INFINITY || (!scrollThresholdPassed && scrollZone === 'body')) && 'invisible',
        theme.darkModeEnabled ? 'text-white' : 'text-black',
        'shadow-sm navbar-light',
        scrollThresholdPassed && scrollZone === 'header' && 'fadeIn',
        scrollThresholdPassed && scrollZone === 'body' && 'fadeOut',
      )}
      style={{
        background: theme.darkModeEnabled ? `rgba(0,0,0,0.1)` : `rgba(255,255,255,0.5)`,
        backdropFilter: 'blur(6px)',
        minHeight: headerHeight,
        fontSize: '120%',
      }}
    >
      <Container>
        <Link to={PageRoutes.index} className={'navbar-brand popIn'}>
          <div className="d-flex flex-row" style={{ fontSize: '120%' }}>
            <div className="d-flex align-items-center me-2">
              <img
                src={siteSettings?.data.site.siteMetadata.siteIcon}
                alt={siteSettings?.data.site.siteMetadata.siteIconAlt}
                width={30}
                height={30}
                className="d-inline-block align-top"
              />
            </div>
            <div className="fw-bold">{siteSettings?.data.site.siteMetadata.siteName}</div>
          </div>
        </Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" aria-labelledby="responsive-navbar-nav-label" />
        <Navbar.Offcanvas id="responsive-navbar-nav" placement="end" className={`d-${expand}-none`}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id={'responsive-navbar-nav-label'} className={textColorClass}>
              Menu
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>{navElements}</Offcanvas.Body>
        </Navbar.Offcanvas>
        <div className={`d-none d-${expand}-flex flex-wrap align-items-center`}>
          <Nav className="me-auto"></Nav>
          {navElements}
        </div>
      </Container>
    </Navbar>
  );
}
