import React from 'react';
import './featured.scss';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Button from '../button/button';

const Featured = ({ type }) => {
  return (
    <div className='featured'>

      <img 
        src="https://images2.alphacoders.com/132/thumb-1920-1320904.jpg" 
        alt="Featured"
      />
      <div className="info">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/5/50/Barbie_%282023_movie_logo%29.png" 
          alt="Movie Logo" 
        />
        <span className='desc'>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quae quibusdam repellendus esse illum non vitae inventore quos voluptate provident nostrum assumenda error, et hic blanditiis aliquam. Omnis nihil voluptatum expedita.
        </span>
        <div className="buttons">
        <Button className={"mt-3 border-white"} variant="default" onClick={() => alert('Primary Button')}>
        Info
      </Button>
      <Button className={"mt-3"} variant="primary" onClick={() => alert('Primary Button')}>
        Play
      </Button>
        </div>
      </div>
    </div>
  );
};

export default Featured;
