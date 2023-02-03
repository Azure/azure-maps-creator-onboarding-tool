import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import BreadCrumbNav from '../bread-crumb-nav/bread-crumb-nav';
import Footer from '../footer/footer';
import TopBar from '../top-bar/top-bar';
import ProgressBar from '../progress-bar/progress-bar';
import ReviewManifestPane from '../review-manifest/';
import { routeStyle } from './route.style';
import { useResponseStore, LRO_STATUS } from 'common/store/response.store';
import { PATHS } from 'common';

const responseStoreSelector = s => s.lroStatus;

const Route = ({ title, component: Component, dataRequired }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lroStatus = useResponseStore(responseStoreSelector);

  useEffect(() => {
    if (dataRequired && lroStatus !== LRO_STATUS.SUCCEEDED) {
      navigate(PATHS.INDEX);
    }
  }, [dataRequired, lroStatus, navigate]);

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
  dataRequired: PropTypes.bool,
};

Route.defaultProps = {
  dataRequired: false,
};

export default Route;