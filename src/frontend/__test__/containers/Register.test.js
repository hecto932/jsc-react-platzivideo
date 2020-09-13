import React from 'react';
import { mount } from 'enzyme';
import Register from '../../containers/Register';
import Provider from '../../__mocks__/ProviderMock';

describe('<Register />', () => {
  test('Register form submit', () => {
    const preventDefault = jest.fn();
    const register = mount(
      <Provider>
        <Register />
      </Provider>,
    );
    register.find('form').simulate('submit', { preventDefault });
    expect(preventDefault).toHaveBeenCalledTimes(1);
    register.unmount();
  });
});
