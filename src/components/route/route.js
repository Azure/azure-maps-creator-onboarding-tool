import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import BreadCrumbNav from '../bread-crumb-nav/bread-crumb-nav';
import Footer from '../footer/footer';
import TopBar from '../top-bar/top-bar';
import ProgressBar from '../progress-bar/progress-bar';
import ReviewManifestPane from '../review-manifest/';

import { routeStyle } from './route.style';

const Route = ({ title, component: Component }) => {
  const { t } = useTranslation();

  return (
    <>
      <TopBar />
      <div className={routeStyle}>
        <BreadCrumbNav />
        <h1>{t(title)}</h1>
        <ProgressBar />
        <Component />
      </div>
      <Footer />
      <ReviewManifestPane />
    </>
  );
};

Route.propTypes = {
  component: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
};

export default Route;