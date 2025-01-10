import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
// services
import { localStorageService } from '@/services/LocalStorageService';
// actions
import {
  authFetchMeAction,
  authLogoutAction,
} from '@/store/actions/auth.action';
import {
  isAuthenticatedSelector,
  isAuthLoadingSelector,
} from '@/store/selectors/auth.selector';
import Loader from '@/components/Loader/Loader';

const AuthenticatedRouteHOC = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  const AuthenticatedRoute: React.FC<P> = ({ ...props }) => {
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const navigateTo = useNavigate();

    const isAuthenticated = useSelector(isAuthenticatedSelector);
    const isLoading = useSelector(isAuthLoadingSelector);

    useEffect(() => {
      const token = localStorageService.getAuthToken();
      const tokenExpiry = localStorageService.getTokenExpiry();
      const currentTime = new Date();
      if (token && !isAuthenticated && !isLoading) {
        dispatch(authFetchMeAction());
      }
      if (token && tokenExpiry && currentTime >= tokenExpiry) {
        localStorage.clear();
        dispatch(authLogoutAction());
        navigateTo('/login');
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, isLoading, searchParams]);

    if (isLoading) {
      return (
        <div className='flex items-center justify-center w-screen h-screen'>
          {/* <Spinner size='lg' /> */}
          <Loader />
        </div>
      );
    }

    if (isAuthenticated) {
      return <Component {...(props as P)} />;
    }
    return <Navigate to='/login' />;
  };

  return AuthenticatedRoute;
};

export default AuthenticatedRouteHOC;
