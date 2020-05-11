import React from 'react';
import Header from '../components/Header';
import Search from '../components/Search';
import Categories from '../components/Categories';
import Carousel from '../components/Carousel';
import CarouselItem from '../components/CarouselItem';
import Footer from '../components/Footer';

import '../assets/styles/App.scss';

import useInitialState from '../hooks/useInitialState';

const API = 'http://localhost:3000/initalState';

const Home = () => {
  const initialState = useInitialState(API);

  return (
    <div className='app'>
      <Header />
      <Search />
      {initialState.myList && (
        <Categories title='Mi lista'>
          <Carousel>
            {initialState.myList.map((item) => {
              return <CarouselItem key={item.id} {...item} />;
            })}
          </Carousel>
        </Categories>
      )}

      <Categories title='Tendencias'>
        <Carousel>
          {initialState.trends.map((item) => {
            return <CarouselItem key={item.id} {...item} />;
          })}
        </Carousel>
      </Categories>

      <Categories title='Originales de PlatziVideo'>
        <Carousel>
          {initialState.originals.map((item) => {
            return <CarouselItem key={item.id} {...item} />;
          })}
        </Carousel>
      </Categories>
      <Footer />
    </div>
  );
};

export default Home;
