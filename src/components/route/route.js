import { cx } from '@emotion/css';
import { PATHS } from 'common';
import { LRO_STATUS, progressBarSteps, useResponseStore, useUserStore } from 'common/store';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import BreadCrumbNav from '../bread-crumb-nav/bread-crumb-nav';
import Footer from '../footer/footer';
import ProgressBar from '../progress-bar/progress-bar';
import TopBar from '../top-bar/top-bar';
import { footerPadding, routeStyle } from './route.style';

const responseStoreSelector = s => s.lroStatus;
const userStoreSelector = s => s.subscriptionKey;

const Route = ({ title, component: Component, dataRequired }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname: currentPath } = useLocation();

  const lroStatus = useResponseStore(responseStoreSelector);
  const subKey = useUserStore(userStoreSelector);

  const shouldShowFooter = useMemo(() => {
    return progressBarSteps.findIndex(route => route.href === currentPath) !== -1;
  }, [currentPath]);

  useEffect(() => {
    // Redirect to index if there is no subscription key
    if (!subKey) navigate(PATHS.INDEX, { replace: true });
  }, [navigate, currentPath, subKey]);

  useEffect(() => {
    if (dataRequired && lroStatus !== LRO_STATUS.SUCCEEDED && lroStatus !== LRO_STATUS.FETCHING_DATA) {
      navigate(PATHS.INDEX);
    }
  }, [dataRequired, lroStatus, navigate]);

  return (
    <>
      <TopBar />
      <div className={cx(routeStyle, { [footerPadding]: shouldShowFooter })}>
        <BreadCrumbNav />
        {title && <h1>{t(title)}</h1>}
        <ProgressBar />
        <Component />
      </div>
      <Footer />
    </>
  );
};

Route.propTypes = {
  component: PropTypes.elementType.isRequired,
  title: PropTypes.string,
  dataRequired: PropTypes.bool,
};

Route.defaultProps = {
  dataRequired: false,
  title: '',
};

export default Route;
