import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import '../assets/styles/components/Header.scss';

import logo from '../assets/static/logo-platzi-video-BW2.png';
import userIcon from '../assets/static/user-icon.png';

import gravatar from '../utils/gravatar';

import { logoutRequest } from '../actions';

const Header = (props) => {
  const { user } = props;

  const handleLogout = () => {
    props.logoutRequest({});
  };
  return (
    <header className='header'>
      <Link to='/'>
        <img className='header__img' src={logo} alt='Platzi Video' />
      </Link>
      <div className='header__menu'>
        <div className='header__menu--profile'>
          <img
            src={user.email ? gravatar(user.email) : userIcon}
            alt={user.email ? user.email : 'User'}
          />
          <p>Perfil</p>
        </div>
        <ul>
          {user.email ? (
            <li>
              <a href='/'>{user.name || 'Cuenta'}</a>
            </li>
          ) : (
            <li>
              <Link to='/register'>Registro</Link>
            </li>
          )}
          {user.email ? (
            <li>
              <a href='#logout' onClick={handleLogout}>
                Cerrar Sesión
              </a>
            </li>
          ) : (
            <li>
              <Link to='/login'>Iniciar sesión</Link>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = {
  logoutRequest,
};
export default connect(mapStateToProps, mapDispatchToProps)(Header);
