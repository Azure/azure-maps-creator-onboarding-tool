import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { cx } from '@emotion/css';
import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import BreadCrumbNav from '../bread-crumb-nav/bread-crumb-nav';
import Footer from '../footer/footer';
import TopBar from '../top-bar/top-bar';
import ProgressBar from '../progress-bar/progress-bar';
import { routeStyle, footerPadding } from './route.style';
import { useResponseStore, LRO_STATUS } from 'common/store/response.store';
import { PATHS } from 'common';
import { progressBarSteps } from 'common/store';

const responseStoreSelector = s => s.lroStatus;

const Route = ({ title, component: Component, dataRequired }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const lroStatus = useResponseStore(responseStoreSelector);

  const shouldShowFooter = useMemo(() => progressBarSteps.findIndex(route => route.href === pathname) !== -1, [pathname]);

  useEffect(() => {
    if (dataRequired && lroStatus !== LRO_STATUS.SUCCEEDED) {
      navigate(PATHS.INDEX);
    }
  }, [dataRequired, lroStatus, navigate]);

  return (
    <>
      <TopBar />
      <div className={cx(routeStyle, {[footerPadding]: shouldShowFooter})}>
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