import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import store from '@/store';
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavigationHandler from '@/shared-resources/NavigationHandler';
import { errorBoundaryHelper } from '@/utils/helpers/errorBoundary.helper';
import Dashboard404Component from '@/utils/helpers/components/Dashboard404Component';
import ErrorFallbackComponent from '@/utils/helpers/components/ErrorFallbackComponent';
import RouteWrapper from '@/RouteWrapper';
import Layout from '@/layout/layout';
import UnauthenticatedRouteHOC from './HOC/UnauthenticatedRoute';
import AuthenticatedRouteHOC from './HOC/AuthenticatedRoute';
import { LAYOUT_ROUTES } from './routes';
import LoginPage from './views/login/LoginPage';
import Loader from './components/Loader/Loader';

const App: React.FC = () => (
  <Provider store={store}>
    <ToastContainer hideProgressBar pauseOnFocusLoss={false} />
    <ErrorBoundary
      FallbackComponent={ErrorFallbackComponent}
      onError={(error, info) => {
        errorBoundaryHelper(error, info); // custom error handler
      }}
    >
      <Suspense fallback={<Loader />}>
        <BrowserRouter>
          <NavigationHandler>
            <RouteWrapper>
              <Routes>
                <Route path='/' element={<Layout />}>
                  {LAYOUT_ROUTES.map((route) => (
                    <Route
                      path={route.path}
                      key={route.key}
                      Component={
                        route.component &&
                        AuthenticatedRouteHOC(route.component)
                      }
                    />
                  ))}
                  <Route
                    path='/login'
                    Component={UnauthenticatedRouteHOC(LoginPage)}
                  />
                  <Route path='*' Component={Dashboard404Component} />
                </Route>
              </Routes>
            </RouteWrapper>
          </NavigationHandler>
        </BrowserRouter>
      </Suspense>
    </ErrorBoundary>
  </Provider>
);

export default App;
