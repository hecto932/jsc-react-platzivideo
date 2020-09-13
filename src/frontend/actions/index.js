import axios from 'axios';

export const setFavorite = (payload) => ({
  type: 'SET_FAVORITE',
  payload,
});

export const deleteFavorite = (payload) => ({
  type: 'DELETE_FAVORITE',
  payload,
});

export const loginRequest = (payload) => ({
  type: 'LOGIN_REQUEST',
  payload,
});

export const logoutRequest = (payload) => ({
  type: 'LOGOUT_REQUEST',
  payload,
});

export const registerRequest = (payload) => ({
  type: 'REGISTER_REQUEST',
  payload,
});

export const getVideoSource = (payload) => ({
  type: 'GET_VIDEO_SOURCE',
  payload,
});

export const setError = (payload) => ({
  type: 'SET_ERROR',
  payload,
});

export const registerUser = (payload, redirectUrl) => {
  return (dispatch) => {
    axios
      .post('/auth/sign-up', payload)
      .then(({ data }) => dispatch(registerRequest(data)))
      .then(() => {
        window.location.href = redirectUrl;
      })
      .catch((error) => dispatch(setError(error)));
  };
};

export const loginUser = ({ email, password }, redirectUrl) => {
  return (dispatch) => {
    axios({
      url: '/auth/sign-in',
      method: 'POST',
      auth: {
        username: email,
        password,
      },
    })
      .then(({ data }) => {
        document.cookie = `email=${data.user.email}`;
        document.cookie = `name=${data.user.name}`;
        document.cookie = `id=${data.user.id}`;

        dispatch(loginRequest(data.user));
      })
      .then(() => {
        window.location.href = redirectUrl;
      })
      .catch((err) => {
        dispatch(setError(err));
      });
  };
};

export const setMovieAsFavorite = ({ userId, movie }) => {
  return (dispatch) => {
    console.log('setMovieAsFavorite => ', userId, movie);

    axios({
      url: '/user-movies',
      method: 'POST',
      data: {
        userId,
        movieId: movie.id,
      },
    })
      .then(({ data }) => {
        console.log('axios result => ', data);
        dispatch(setFavorite(movie));
      })
      .catch((err) => {
        console.log('ERROR', err);
        dispatch(setError(err));
      });
  };
};

export const deleteMovieAsFavorite = (movieId) => {
  return (dispatch) => {
    axios({
      url: `/user-movies/${movieId}`,
      method: 'DELETE',
    })
      .then(() => {
        dispatch(deleteFavorite(movieId));
      })
      .catch((err) => dispatch(setError(err)));
  };
};
