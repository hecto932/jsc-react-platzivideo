/* eslint-disable indent */
/* eslint-disable global-require */
import express, { response } from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import webpack from 'webpack';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { renderRoutes } from 'react-router-config';
import { StaticRouter } from 'react-router-dom';
import cookieParser from 'cookie-parser';
import boom from '@hapi/boom';
import passport from 'passport';
import axios from 'axios';
import serverRoutes from '../frontend/routes/serverRoutes';
import reducer from '../frontend/reducers';
import getManifest from './getManifest';

dotenv.config();

const { ENV, PORT } = process.env;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

require('./utils/auth/strategies/basic');

if (ENV === 'development') {
  const webpackConfig = require('../../webpack.config');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(webpackConfig);
  const serverConfig = {
    port: PORT,
    hot: true,
  };

  app.use(webpackDevMiddleware(compiler, serverConfig));
  app.use(webpackHotMiddleware(compiler));
} else {
  app.use((req, res, next) => {
    if (!req.hashManifest) {
      req.hashManifest = getManifest();
    }
    next();
  });
  app.use(express.static(`${__dirname}/public`));
  app.use(helmet());
  app.use(helmet.permittedCrossDomainPolicies());
  app.disable('x-powered-by');
}

const setResponse = (html, preloadedState, manifest) => {
  const mainStyles = manifest ? manifest['main.css'] : 'assets/app.css';
  const mainBuild = manifest ? manifest['main.js'] : 'assets/app.js';
  const vendorBuild = manifest ? manifest['vendors.js'] : 'assets/vendor.js';
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="${mainStyles}" type="text/css">
        <title>Platzi Video</title>
      </head>
      <body>
        <div id="app">${html}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(
            /</g,
            '\\u003c',
          )}
        </script>
        <script src="${mainBuild}" type="text/javascript"></script>
        <script src="${vendorBuild}" type="text/javascript"></script>
      </body>
    </html>
    `;
};

const renderApp = async (req, res) => {
  let initialState;
  const { token, email, name, id } = req.cookies;

  try {
    let movieList = await axios({
      url: `${process.env.API_URL}/api/movies`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    });
    movieList = movieList.data.data;

    let { data: userMovies } = await axios({
      url: `${process.env.API_URL}/api/user-movies`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    });
    userMovies = userMovies.data.map((item) => item.movieId);

    const myList = movieList.filter(
      (movie) => userMovies.indexOf(movie._id) !== -1,
    );

    initialState = {
      user: {
        email,
        name,
        id,
      },
      myList,
      trends: movieList.filter(
        (movie) =>
          movie.contentRating === 'PG' &&
          movie._id &&
          userMovies.indexOf(movie._id) === -1,
      ),
      originals: movieList.filter(
        (movie) =>
          movie.contentRating === 'G' &&
          movie._id &&
          userMovies.indexOf(movie._id) === -1,
      ),
    };
  } catch (err) {
    console.log('ERROR => ', err.message);
    initialState = {
      user: {},
      myList: [],
      trends: [],
      originals: [],
    };
  }

  const store = createStore(reducer, initialState);
  const preloadedState = store.getState();
  const isLogged = initialState.user.id;
  const html = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={{}}>
        {renderRoutes(serverRoutes(isLogged))}
      </StaticRouter>
    </Provider>,
  );

  res.send(setResponse(html, preloadedState, req.hashManifest));
};

app.post('/auth/sign-in', async (req, res, next) => {
  passport.authenticate('basic', (error, data) => {
    try {
      if (error || !data) {
        next(boom.unauthorized());
      }

      req.login(data, { session: false }, async (err) => {
        if (err) {
          next(err);
        }

        const { token, ...user } = data;

        res.cookie('token', token, {
          httpOnly: !(ENV === 'development'),
          secure: !(ENV === 'development'),
        });

        res.status(200).json(user);
      });
    } catch (err) {
      next(err);
    }
  })(req, res, next);
});

app.post('/auth/sign-up', async (req, res, next) => {
  const { body: user } = req;

  try {
    const userData = await axios({
      url: `${process.env.API_URL}/api/auth/sign-up`,
      method: 'post',
      data: {
        email: user.email,
        name: user.name,
        password: user.password,
      },
    });

    res.status(201).json({
      name: req.body.name,
      email: req.body.email,
      id: userData.data.id,
    });
  } catch (error) {
    next(error);
  }
});

app.post('/user-movies', async (req, res, next) => {
  const { body: userMovie } = req;
  const { token } = req.cookies;

  try {
    const { data, status } = await axios({
      url: `${process.env.API_URL}/api/user-movies`,
      headers: { Authorization: `Bearer ${token}` },
      data: userMovie,
      method: 'POST',
    });
    console.log('server -> ', data, status);

    if (status !== 200 && status !== 201) {
      return next(boom.badImplementation());
    }

    res.status(201).json({
      data,
    });
  } catch (err) {
    next(err);
  }
});

app.delete('/user-movies/:movieId', async (req, res, next) => {
  const { movieId } = req.params;
  const { token } = req.cookies;
  try {
    const { data, status } = await axios({
      url: `${process.env.API_URL}/api/user-movies/${movieId}`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'DELETE',
    });

    if (status !== 200 && status !== 201) {
      return next(boom.badImplementation());
    }

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

app.get('*', renderApp);

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server running on port ${PORT}`);
  }
});
