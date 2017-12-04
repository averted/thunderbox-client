// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import document from 'global/document'
import { Router, Route, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import * as reducers from './reducers'
import { App } from './modules'

// Redux Store
const store = createStore(combineReducers(reducers), applyMiddleware(thunk))

// Routes
const routes = (
  <Route path="/" component={App} />
)

// Render app
ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>{routes}</Router>
  </Provider>,
  document.getElementById('app')
)
