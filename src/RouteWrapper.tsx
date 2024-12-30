import { FC, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { localStorageService, PREV_LINK } from '@/services/LocalStorageService';

interface RouteWrapperProps {
  children: any;
}

const RouteWrapper: FC<RouteWrapperProps> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    if (
      !location.pathname.includes('login') &&
      !location.pathname.includes('logout') &&
      !location.pathname.includes('reset-password') &&
      !location.pathname.includes('forgot-password')
    ) {
      localStorageService.setLocalStorageValue(
        PREV_LINK,
        `${location.pathname}${location.search}`
      );
    }
  }, [location]);

  return children;
};

export default RouteWrapper;
