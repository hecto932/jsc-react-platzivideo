import React from 'react';
import clsx from 'clsx';
import '../assets/styles/components/Search.scss';

const Search = ({ isHome }) => {
  const inputStyle = clsx('input', {
    isHome,
  });
  return (
    <section className='main'>
      <h2 className='main__title'>Que quieres buscar hoy?</h2>
      <input className={inputStyle} type='text' placeholder='Buscar...' />
    </section>
  );
};

export default Search;
