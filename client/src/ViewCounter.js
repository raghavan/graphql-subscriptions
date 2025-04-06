// src/ViewCounter.js
import React, { useEffect, useState } from 'react';
import { useSubscription, gql } from '@apollo/client';

const COUNTER_SUBSCRIPTION = gql`
  subscription {
    counterUpdated
  }
`;

const NEW_COUNTER_SUBSCRIPTION = gql`
  subscription {
    newCounterUpdated
  }
`;

const ViewCounter = () => {
  const [oldCounter, setOldCounter] = useState(null);
  const [newCounter, setNewCounter] = useState(null);

  const { data: oldData, loading: oldLoading, error: oldError } = useSubscription(COUNTER_SUBSCRIPTION, {
    onError: (err) => console.error('Old subscription error:', err),
  });

  const { data: newData, loading: newLoading, error: newError } = useSubscription(NEW_COUNTER_SUBSCRIPTION, {
    onError: (err) => console.error('New subscription error:', err),
  });

  useEffect(() => {
    if (oldError) console.error('Error in old subscription:', oldError);
    if (oldData && oldData.counterUpdated !== undefined) {
      setOldCounter(oldData.counterUpdated);
    }
  }, [oldData, oldError]);

  useEffect(() => {
    if (newError) console.error('Error in new subscription:', newError);
    if (newData && newData.newCounterUpdated !== undefined) {
      setNewCounter(newData.newCounterUpdated);
    }
  }, [newData, newError]);

  if (oldLoading || newLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Old Counter: {oldCounter}</h1>
      <h1>New Counter: {newCounter}</h1>
    </div>
  );
};

export default ViewCounter;
