import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';

import App from './routes/App';

import reducer from './reducers';

const history = createBrowserHistory();
const preloadState = window.__PRELOADED_STATE__;
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  preloadState,
  composeEnhancers(applyMiddleware(thunk)),
);

delete window.__PRELOADED_STATE__;

ReactDOM.hydrate(
  <Provider store={store}>
    <Router history={history}>
      <App isLogged={preloadState.user.id} />
    </Router>
  </Provider>,
  document.getElementById('app'),
);
