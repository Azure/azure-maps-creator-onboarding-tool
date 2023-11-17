import { Breadcrumb } from '@fluentui/react/lib/Breadcrumb';
import { PATHS, ROUTE_NAME_BY_PATH } from 'common/constants';
import { getSplitPaths } from 'common/functions';
import { useConversionStore, useUserStore } from 'common/store';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { shallow } from 'zustand/shallow';
import { breadcrumbStyle } from './bread-crumb-nav.style';

const routesReset = [PATHS.CONVERSION];

const userStoreSelector = s => [s.subscriptionKey];

const BreadCrumbNav = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname: currentPath } = useLocation();
  const [subKey] = useUserStore(userStoreSelector, shallow);

  const splitPaths = getSplitPaths(currentPath);
  const itemsWithHeading = [];

  useEffect(() => {
    if (!subKey) {
      navigate(PATHS.INDEX, { replace: true });
    }
  }, [navigate, currentPath, subKey]);

  splitPaths.forEach(nextPath => {
    if (ROUTE_NAME_BY_PATH.hasOwnProperty(nextPath)) {
      itemsWithHeading.push({
        text: t(ROUTE_NAME_BY_PATH[nextPath]),
        key: ROUTE_NAME_BY_PATH[nextPath],
        onClick: () => {
          if (currentPath === nextPath) return;
          if (routesReset.includes(currentPath)) {
            if (window.confirm(t('progress.will.be.lost'))) {
              useConversionStore.getState().reset();
              navigate(nextPath);
            }
          } else if (currentPath !== PATHS.CONVERSIONS && nextPath === PATHS.INDEX) {
            if (window.confirm(t('progress.will.be.lost'))) {
              navigate(nextPath);
            }
          } else {
            navigate(nextPath);
          }
        },
      });
    }
  });

  return (
    <Breadcrumb
      ariaLabel={t('navigational.breadcrumb')}
      items={itemsWithHeading}
      overflowAriaLabel={t('more.links')}
      styles={breadcrumbStyle}
    />
  );
};

export default BreadCrumbNav;
