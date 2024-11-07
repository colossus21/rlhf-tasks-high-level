
import React, { useState, useEffect } from 'react';

function AsyncComponent() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetchData().then((result) => {
      setData(result);
    });
  }, []);
  const fetchData = async () => {
    const response = await fetch('https://randomuser.me/api/?results=10');
    const result = await response.json();
    return result;
  };
  return <div>{data ? data.message : 'Loading...'}</div>;
}

export default AsyncComponent;
    