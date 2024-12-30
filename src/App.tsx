import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import store from '@/store';
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
// import UnauthenticatedRouteHOC from './HOC/UnauthenticatedRoute';
// import Login from './views/login/Login';
import 'react-toastify/dist/ReactToastify.css';
import NavigationHandler from '@/shared-resources/NavigationHandler';
import { errorBoundaryHelper } from '@/utils/helpers/errorBoundary.helper';
import Dashboard404Component from '@/utils/helpers/components/Dashboard404Component';
import ErrorFallbackComponent from '@/utils/helpers/components/ErrorFallbackComponent';
import RouteWrapper from '@/RouteWrapper';
import Layout from '@/layout/layout';
import AuthenticatedRouteHOC from './HOC/AuthenticatedRoute';
import { LAYOUT_ROUTES } from './routes';

const App: React.FC = () => (
  <Provider store={store}>
    <ToastContainer
      hideProgressBar
      pauseOnFocusLoss={false}
      toastClassName='relative flex p-2 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer font-medium'
    />
    <ErrorBoundary
      FallbackComponent={ErrorFallbackComponent}
      onError={(error, info) => {
        // Sentry.captureException(error); // Capture the error in Sentry
        errorBoundaryHelper(error, info); // Your custom error handler
      }}
    >
      <Suspense fallback='Loading...'>
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
                    // Component={UnauthenticatedRouteHOC(Login)}
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
