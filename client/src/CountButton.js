// src/CountButton.js
import React from 'react';
import { useMutation, gql } from '@apollo/client';

const INCREMENT_COUNTER = gql`
  mutation {
    incrementCounter
  }
`;

const INCREMENT_NEW_COUNTER = gql`
  mutation {
    incrementNewCounter
  }
`;

const CountButton = () => {
  const [incrementCounter, { data: oldData, loading: oldLoading, error: oldError }] = useMutation(INCREMENT_COUNTER);
  const [incrementNewCounter, { data: newData, loading: newLoading, error: newError }] = useMutation(INCREMENT_NEW_COUNTER);

  return (
    <div>
      <button onClick={() => incrementCounter()}>Old Increment Counter</button>
      {oldLoading && <p>Incrementing Old...</p>}
      {oldError && <p>Error occurred in Old increment</p>}
      {oldData && <p>Old Counter: {oldData.incrementCounter}</p>}

      <button onClick={() => incrementNewCounter()}>New Increment Counter</button>
      {newLoading && <p>Incrementing New...</p>}
      {newError && <p>Error occurred in New increment</p>}
      {newData && <p>New Counter: {newData.incrementNewCounter}</p>}
    </div>
  );
};

export default CountButton;
