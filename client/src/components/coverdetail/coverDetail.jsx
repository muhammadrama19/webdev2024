import React from 'react';
import './coverDetail.scss';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Button from '../button/button';

const CoverDetail = ({ type, srcBackground }) => {
  return (
    <div className='coverDetail'>

      <img 
        src={srcBackground} 
        alt="coverDetail"
      />
   
    </div>
  );
};

export default CoverDetail;
