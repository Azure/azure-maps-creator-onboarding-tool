import { Breadcrumb } from '@fluentui/react/lib/Breadcrumb';
import { PATHS, PLACES_ROUTE_NAME_BY_PATH, ROUTE_NAME_BY_PATH } from 'common/constants';
import { getSplitPaths } from 'common/functions';
import { useConversionStore } from 'common/store';
import { useAlert, useCustomNavigate, useFeatureFlags } from 'hooks';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { breadcrumbStyle } from './bread-crumb-nav.style';

const BreadCrumbNav = () => {
  const { t } = useTranslation();
  const navigate = useCustomNavigate();
  const { pathname: currentPath } = useLocation();
  const { isPlacesPreview } = useFeatureFlags();
  const alert = useAlert();

  const navigationRules = [
    {
      from: [PATHS.CREATE_GEOREFERENCE, PATHS.LAYERS, PATHS.LEVELS, PATHS.REVIEW_CREATE],
      to: PATHS.INDEX,
      navigate: url => {
        alert.ask({
          onOk: () => {
            navigate(url);
          },
        });
      },
    },
    {
      from: [PATHS.CONVERSION, PATHS.IMDF_CONVERSION],
      navigate: url => {
        alert.ask({
          onOk: () => {
            useConversionStore.getState().reset();
            navigate(url);
          },
        });
      },
    },
  ];

  const splitPaths = getSplitPaths(currentPath);
  const itemsWithHeading = [];

  splitPaths.forEach(nextPath => {
    if (ROUTE_NAME_BY_PATH.hasOwnProperty(nextPath)) {
      const text = (isPlacesPreview && t(PLACES_ROUTE_NAME_BY_PATH[nextPath])) || t(ROUTE_NAME_BY_PATH[nextPath]);

      itemsWithHeading.push({
        text: text,
        key: ROUTE_NAME_BY_PATH[nextPath],
        onClick: () => {
          const rule = navigationRules.find(
            rule =>
              (rule.from === currentPath || rule.from.includes(currentPath)) &&
              (!rule.to || rule.to === nextPath || rule.to.includes(nextPath))
          );

          if (currentPath === nextPath) return;
          if (!rule) navigate(nextPath);

          rule.navigate(nextPath);
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
