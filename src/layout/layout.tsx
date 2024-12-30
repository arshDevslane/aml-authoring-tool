import React, { useEffect, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { isAuthLoadingSelector } from '@/store/selectors/auth.selector';
import { webRoutes } from '@/utils/helpers/constants/webRoutes.constants';
import { authLogoutAction } from '@/store/actions/auth.action';
import { AuthContext } from '@/context/AuthContext';
// import Header from './Header';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const isUserLoading = useSelector(isAuthLoadingSelector);

  useEffect(() => {
    if (location.pathname === '/' && !isUserLoading) {
      navigate(webRoutes.auth.login());
    }
  }, [location, isUserLoading, navigate]);

  const onLogout = () => {
    dispatch(authLogoutAction());
  };

  const authContextValue = useMemo(() => ({ onLogout }), []);

  return isUserLoading ? null : (
    <AuthContext.Provider value={authContextValue}>
      <div className='flex h-full'>
        {/* <Header username={} /> */}
        <div className='flex flex-1 overflow-y-hidden'>
          <Outlet />
        </div>
      </div>
    </AuthContext.Provider>
  );
};

export default Layout;
