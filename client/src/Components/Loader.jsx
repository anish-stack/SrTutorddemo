// Loader.js
import React, { useState, useEffect } from 'react';
import './loader.css'; // Import the custom CSS for the loader

const Loader = () => {
  const [message, setMessage] = useState('Please wait, we are finding a teacher for you...');
  
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setMessage('We are on the way...');
    }, 400); // Change message after 3 seconds

    const timer2 = setTimeout(() => {
      setMessage('Good news! Teacher found.');
    }, 600); // Change message after another 3 seconds

    const timer3 = setTimeout(() => {
      setMessage('Sorry for the delay...');
    }, 1000); // Change message after another 3 seconds

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="loader-container">
      <div className="loader"></div>
      <p className="loader-text">{message}</p>
    </div>
  );
};

export default Loader;
