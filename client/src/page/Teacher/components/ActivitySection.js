import React from 'react';
import gif from './open-gift.gif';

const ActivitySection = ({ onUpgrade }) => {
  return (
    <div className="activity-section text-center py-5">
      <img src={gif} alt="Special Feature" className="img-fluid mb-4" style={{ maxWidth: '200px' }} />
      <div className="container">
        <h3 className="h2 mb-3">
          Unlock Exclusive Features with{' '}
          <span className="text-danger">Sr Tutors</span>
        </h3>
        <p className="text-muted mb-4">
          Upgrade to a paid membership to access exclusive features and attract more students.
        </p>
        <button
          onClick={onUpgrade}
          className="btn btn-primary btn-lg px-5"
        >
          Upgrade Now
        </button>
      </div>
    </div>
  );
};

export default ActivitySection;