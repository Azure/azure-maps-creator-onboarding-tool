import { Breadcrumb } from '@fluentui/react/lib/Breadcrumb';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

import { breadcrumbStyle } from './bread-crumb-nav.style';
import { getSplitPaths } from 'common/functions';
import { ROUTE_NAME_BY_PATH } from 'common/constants';

const BreadCrumbNav = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const splitPaths = getSplitPaths(pathname);
  const itemsWithHeading = [];

  splitPaths.forEach((path) => {
    if (ROUTE_NAME_BY_PATH.hasOwnProperty(path)) {
      itemsWithHeading.push({ text: t(ROUTE_NAME_BY_PATH[path]), key: ROUTE_NAME_BY_PATH[path], onClick: () => navigate(path) });
    }
  });

  return (
    <Breadcrumb ariaLabel={t('navigational.breadcrumb')} items={itemsWithHeading}
                overflowAriaLabel={t('more.links')} styles={breadcrumbStyle} />
  );
};

export default BreadCrumbNav;