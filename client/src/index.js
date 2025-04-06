// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  split,
} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ViewCounter from './ViewCounter';
import CountButton from './CountButton';

// HTTP connection to the GraphQL API.
const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
});

// WebSocket link for subscriptions.
const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
  },
});

// Using the split function to route between HTTP and WS links.
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

// Apollo client instance.
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

// Define the main App with two routes.
const App = () => (
  <ApolloProvider client={client}>
    <BrowserRouter>
      <Routes>
        <Route path="/view" element={<ViewCounter />} />
        <Route path="/count" element={<CountButton />} />
      </Routes>
    </BrowserRouter>
  </ApolloProvider>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
