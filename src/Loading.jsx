import React from 'react';
import loadingAnimation from "./assets/loading.svg";

const LoadingComponent = ({ isLoading }) => {
  return (
    <div>
      {isLoading && (
        <div className='w-12 h-4 ml-4'>
          <img src={loadingAnimation} alt="Loading request" />
        </div>
      )}
    </div>
  );
};

export default LoadingComponent;
