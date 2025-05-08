import React from 'react';
import '../styles/ErrorMessage.css';

const ErrorMessage = ({ message, error, onRetry }) => {
  return (
    <div className="error-message">
      <div className="error-icon">⚠️</div>
      <h3>{message || 'Something went wrong'}</h3>
      {error && <p className="error-details">{error.toString()}</p>}
      {onRetry && (
        <button className="retry-button" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;