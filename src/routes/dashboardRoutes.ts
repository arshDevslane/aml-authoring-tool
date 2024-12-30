import { webRoutes } from '@/utils/helpers/constants/webRoutes.constants';
import { RouteKey } from '@/types/enum';
import AppLayout from '@/layout/AppLayout';
import { AppRoutesConfigType } from './routes.types';

export const dashboardRoutes: Array<AppRoutesConfigType> = [
  {
    name: 'app',
    path: `${webRoutes.app.root()}/*`,
    key: RouteKey.APP,
    component: AppLayout, // New layout for `/app`
  },
];
