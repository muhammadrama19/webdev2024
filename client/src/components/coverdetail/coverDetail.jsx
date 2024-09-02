import React from 'react';
import './coverDetail.scss';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Button from '../button/button';

const CoverDetail = ({ type }) => {
  return (
    <div className='featured'>

      <img 
        src="https://media.themoviedb.org/t/p/w1066_and_h600_bestv2/vGgMkqnRtVV42KX7xJv63WJ7B4Z.jpg" 
        alt="Featured"
      />
   
    </div>
  );
};

export default CoverDetail;
