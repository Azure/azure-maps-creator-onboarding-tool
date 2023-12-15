import { cx } from '@emotion/css';
import { PATHS } from 'common';
import { LRO_STATUS, progressBarSteps, useResponseStore, useUserStore } from 'common/store';
import { useCustomNavigate } from 'hooks';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import BreadCrumbNav from '../bread-crumb-nav/bread-crumb-nav';
import Footer from '../footer/footer';
import ProgressBar from '../progress-bar/progress-bar';
import TopBar from '../top-bar/top-bar';
import { footerPadding, routeStyle } from './route.style';
const responseStoreSelector = s => s.lroStatus;
const userStoreSelector = s => s.subscriptionKey;

const openRoutes = [PATHS.INDEX, PATHS.CREATE_UPLOAD, PATHS.VIEW_CONVERSIONS];

const Route = ({ title, component: Component, dataRequired }) => {
  const { t } = useTranslation();
  const navigate = useCustomNavigate();
  const { pathname: currentPath } = useLocation();

  const lroStatus = useResponseStore(responseStoreSelector);
  const subKey = useUserStore(userStoreSelector);

  const shouldShowFooter = useMemo(() => {
    return progressBarSteps.findIndex(route => route.href === currentPath) !== -1;
  }, [currentPath]);

  useEffect(() => {
    if (openRoutes.includes(currentPath)) return;
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
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#525252',
            color: '#fff',
            borderRadius: 4,
            padding: '0.75rem 1rem',
          },
        }}
      />
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
