import React from 'react';

import '../assets/styles/components/Player.scss';

const Player = (props) => {
  return (
    <div className='Player'>
      <video controls autoPlay>
        <source src='' type='video/mp4' />
      </video>
      <div className='Player-back'>
        <button type='button' onClick={(e) => props.history.goBack()}>
          Regresar
        </button>
      </div>
    </div>
  );
};

export default Player;
