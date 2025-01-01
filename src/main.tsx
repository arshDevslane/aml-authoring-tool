import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import ENV_CONFIG from '@/constant/env.config';
import App from './App';

if (ENV_CONFIG.APP_ENV !== 'development') {
  // eslint-disable-next-line no-console
  // console.log = () => {};
}

const root = createRoot(document.querySelector('#root')!);
root.render(<App />);
