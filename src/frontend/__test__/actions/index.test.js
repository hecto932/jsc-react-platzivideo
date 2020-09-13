import { setFavorite, loginRequest } from '../../actions';
import MovieMock from '../../__mocks__/MovieMock';

describe('Actions', () => {
  test('setFavorite', () => {
    const payload = MovieMock;
    const expectedAction = {
      type: 'SET_FAVORITE',
      payload,
    };
    expect(setFavorite(payload)).toEqual(expectedAction);
  });

  test('Login', () => {
    const payload = {
      email: 'test@test.com',
      password: 'password',
    };
    const expectedAction = {
      type: 'LOGIN_REQUEST',
      payload,
    };

    expect(loginRequest(payload)).toEqual(expectedAction);
  });
});
