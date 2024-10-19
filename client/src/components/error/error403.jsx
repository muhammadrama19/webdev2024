import React from 'react';
import './error403.scss'; // Import the SCSS file

const Error403 = () => {
  return (
    <div className="error-container">
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 1000 1000"
        enableBackground="new 0 0 1000 1000"
        className="whistle"
      >
      
      </svg>
      <h1 className='errorCode'>403</h1>
      <h2 className='infoError'>Not this time, access forbidden!</h2>
    </div>
  );
};

export default Error403;
