import React from 'react';

const PageNotFound = () => {
  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center">
        <h1 className="display-1 text-danger">❌</h1>
        <h2 className="mb-4">404</h2>
        <p className="lead">Page Not Found</p>
        <a href="/" className="btn btn-primary">Go Home</a>
      </div>
    </div>
  );
};

export default PageNotFound;
