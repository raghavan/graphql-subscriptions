// src/ViewCounter.js
import React, { useEffect, useState } from 'react';
import { useSubscription, gql } from '@apollo/client';

const COUNTER_SUBSCRIPTION = gql`
  subscription {
    counterUpdated
  }
`;

const ViewCounter = () => {
  const [counter, setCounter] = useState(null);

  // Add an onError callback to log errors and inspect the data flow.
  const { data, loading, error } = useSubscription(COUNTER_SUBSCRIPTION, {
    onError: (err) => {
      console.error('Subscription error (onError callback):', err);
    },
  });

  useEffect(() => {
    if (error) {
      console.error('Subscription hook error:', error);
    }
    if (data) {
      console.log('Received subscription data:', data);
      if (data.counterUpdated !== undefined) {
        setCounter(data.counterUpdated);
      } else {
        console.warn('Subscription data does not contain counterUpdated field:', data);
      }
    }
  }, [data, error]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error in subscription: {error.message}</p>;

  return (
    <div>
      <h1>Counter: {counter}</h1>
    </div>
  );
};

export default ViewCounter;
