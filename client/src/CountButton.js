// src/CountButton.js
import React from 'react';
import { useMutation, gql } from '@apollo/client';

const INCREMENT_COUNTER = gql`
  mutation {
    incrementCounter
  }
`;

const CountButton = () => {
  const [incrementCounter, { data, loading, error }] = useMutation(INCREMENT_COUNTER);

  const handleClick = () => {
    incrementCounter();
  };

  return (
    <div>
      <button onClick={handleClick}>Increment Counter</button>
      {loading && <p>Incrementing...</p>}
      {error && <p>Error occurred</p>}
      {data && <p>New Counter: {data.incrementCounter}</p>}
    </div>
  );
};

export default CountButton;
