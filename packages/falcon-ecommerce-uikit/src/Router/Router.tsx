import React from 'react';
import ReactRouterDom, { withRouter, RouteComponentProps } from 'react-router-dom';
// eslint-disable-next-line
import { History, Location } from 'history';

export type IRenderRouterProps = {
  children: (props: ReactRouterRenderProps) => any;
} & RouteComponentProps;

export type ReactRouterRenderProps = {
  match: ReactRouterDom.match;
  location: Location;
  history: History;
};

const RenderRouterProps: React.SFC<IRenderRouterProps> = props => {
  const { match, location, history, children } = props;

  return (children as Function)({ match, location, history });
};

export const Router = withRouter(RenderRouterProps);
