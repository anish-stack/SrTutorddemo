import React from 'react';

const ThankYouPage = () => {
    return (
        <div className="container  d-flex justify-content-center align-items-center min-vh-100">
            <div className="text-center">
                <div className="mb-4">
                  <div className='col-md-4 mx-auto'>
                  <img 
                        src="https://i.ibb.co/7yrrtDB/image.png" 
                        alt="Thank You" 
                        className="img-fluid"
                    />
                  </div>
                </div>
                <h1 className="display-4 mb-4">Thank You!</h1>
                <p className="lead">
                    Your request has been received successfully. We appreciate your request and will get back to you shortly.
                </p>
                <a href="/" className="btn btn-danger btn-lg">Go to Homepage</a>
            </div>
        </div>
    );
};

export default ThankYouPage;
