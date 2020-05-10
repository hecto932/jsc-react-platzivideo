import React from 'react';
import PropTypes, { string } from 'prop-types';

import '../assets/styles/CarouselItem.scss';

import playIcon from '../assets/static/play-icon.png';
import plusIcon from '../assets/static/plus-icon.png';

const CarouselItem = ({ cover, title, year, contentRaiting, duration }) => (
  <div className='carousel-item'>
    <img className='carousel-item__img' src={cover} alt={title} />
    <div className='carousel-item__details'>
      <div>
        <img
          className='carousel-item__details--img'
          src={playIcon}
          alt='Play Icon'
        />
        <img
          className='carousel-item__details--img'
          src={plusIcon}
          alt='Plus Icon'
        />
      </div>
      <p className='carousel-item__details--title'>{title}</p>
      <p className='carousel-item__details--subtitle'>{`${year} ${contentRaiting} ${duration}`}</p>
    </div>
  </div>
);

CarouselItem.propTypes = {
  cover: PropTypes.string,
  title: PropTypes.string,
  year: PropTypes.number,
  contentRaiting: PropTypes.string,
  duration: PropTypes.number,
};

export default CarouselItem;
