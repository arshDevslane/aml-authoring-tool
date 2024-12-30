/* eslint-disable react/jsx-no-useless-fragment */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { navigationPathSelector } from '@/store/selectors/navigation.selector';

// Define props for NavigationHandler
type NavigationHandlerProps = {
  children: React.ReactNode; // To accept any children passed to the component
};

const NavigationHandler: React.FC<NavigationHandlerProps> = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const navigationPath = useSelector(navigationPathSelector);

  useEffect(() => {
    if (navigationPath) {
      navigate(navigationPath); // Perform the navigation
      dispatch({ type: 'CLEAR_NAVIGATION_PATH' }); // Clear the navigation path after navigating
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigationPath, navigate]);

  return <>{children}</>; // Render the children
};

export default NavigationHandler;
