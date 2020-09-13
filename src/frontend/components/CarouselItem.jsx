/* eslint-disable jsx-quotes */
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { deleteMovieAsFavorite, setMovieAsFavorite } from '../actions';

import '../assets/styles/components/CarouselItem.scss';

import playIcon from '../assets/static/play-icon.png';
import plusIcon from '../assets/static/plus-icon.png';
import removeIcon from '../assets/static/remove-icon.png';

const CarouselItem = (props) => {
  const {
    _id,
    id,
    cover,
    title,
    year,
    contentRating,
    duration,
    isList,
    slug,
    source,
  } = props;
  console.log('CarouselItem => ', props);
  const handleSetFavorite = () => {
    const movie = {
      _id,
      id: _id,
      cover,
      title,
      year,
      contentRating,
      duration,
      isList,
      slug,
      source,
    };
    console.log('movie', movie);
    const userId = document.cookie.replace(
      /(?:(?:^|.*;\s*)id\s*=\s*([^;]*).*$)|^.*$/,
      '$1',
    );
    props.setMovieAsFavorite({ userId, movie });
  };

  const handleDeleteFavorite = (itemId) => {
    props.deleteMovieAsFavorite(itemId);
  };
  return (
    <div className="carousel-item">
      <img className="carousel-item__img" src={cover} alt={title} />
      <div className="carousel-item__details">
        <div>
          <Link to={`/player/${id}`}>
            <img
              className="carousel-item__details--img"
              src={playIcon}
              alt="Play Icon"
            />
          </Link>

          {isList ? (
            <img
              onClick={() => handleDeleteFavorite(id)}
              className="carousel-item__details--img"
              src={removeIcon}
              alt="Plus Icon"
            />
          ) : (
            <img
              onClick={handleSetFavorite}
              className="carousel-item__details--img"
              src={plusIcon}
              alt="Plus Icon"
            />
          )}
        </div>
        <p className="carousel-item__details--title">{title}</p>
        <p className="carousel-item__details--subtitle">{`${year} ${contentRating} ${duration}`}</p>
      </div>
    </div>
  );
};

CarouselItem.propTypes = {
  cover: PropTypes.string,
  title: PropTypes.string,
  year: PropTypes.number,
  contentRating: PropTypes.string,
  duration: PropTypes.number,
};

const mapDispatchToProps = {
  setMovieAsFavorite,
  deleteMovieAsFavorite,
};

export default connect(null, mapDispatchToProps)(CarouselItem);
