import React from 'react';

export interface BaseRouteConfigType {
  name: string;
  key: string;
  path: string;
  allowedRoles?: string[];
  childPathKey?: string;
}

export interface AppRoutesConfigType extends BaseRouteConfigType {
  component?: React.FC;
  isBottomItem?: boolean;
  isHover?: boolean;
}
