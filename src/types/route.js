// @flow
type Route = {
  component: Function,
  name: string,
  path: string,
}

export type IRoute = {
  childRoutes: Array<Route>,
  component: Function,
  name: string,
  path: string,
}

export type ILocation = {
  action: string,
  hash: string,
  key: string,
  pathname: string,
  query: Object,
  search: string,
  state: any,
}
