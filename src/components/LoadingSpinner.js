import React from 'react';
import '../styles/LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-overlay">
      <div className="loading-spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p>Loading...</p>
    </div>
  );
};

export default LoadingSpinner;