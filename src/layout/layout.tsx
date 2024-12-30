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
  }, [location, isUserLoading]);

  const onLogout = () => {
    dispatch(authLogoutAction());
  };

  const authContextValue = useMemo(() => ({ onLogout }), []);

  return isUserLoading ? null : (
    <AuthContext.Provider value={authContextValue}>
      <div className='relative min-h-screen flex justify-center items-center w-full'>
        {/* Abstract Symmetrical Background */}
        <div className='absolute inset-0 -z-10 flex justify-center items-center bg-gray-100 overflow-hidden'>
          <div className='bg-gradient-to-br from-gray-200 to-gray-300 opacity-50 w-[80vw] h-[80vw] rounded-full absolute' />
          <div className='bg-gradient-to-tr from-gray-300 to-gray-400 opacity-30 w-[60vw] h-[60vw] rounded-full absolute' />
        </div>

        {/* Main Content */}
        <div className='w-full overflow-y-hidden relative z-10'>
          <Outlet />
        </div>
      </div>
    </AuthContext.Provider>
  );
};

export default Layout;
