import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Marquee from './marquee';
import HomeLoader from '../HomeLoader';

const SlidingData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/v1/student/AllData');
        console.log(response.data.data)
        setData(response.data.data); // Assuming the data is in response.data.data
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once when the component mounts

  // Render logic
  if (loading) {
    return <div><HomeLoader /></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Marquee data={data} />
  );
};

export default SlidingData;
