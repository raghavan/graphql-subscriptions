// server.js
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { PubSub } = require('graphql-subscriptions');
const { createServer } = require('http');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { execute, subscribe } = require('graphql');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const app = express();
const pubsub = new PubSub();

// In-memory storage for the counter and subscribers.
let count = 0;
const subscribers = new Map();

// Define GraphQL schema
const typeDefs = gql`
  type Query {
    counter: Int!
  }

  type Mutation {
    incrementCounter: Int!
  }

  type Subscription {
    counterUpdated: Int!
  }
`;

const resolvers = {
  Query: {
    counter: () => count,
  },
  Mutation: {
    incrementCounter: () => {
      count++;
      // Publish the updated count to all subscribers.
      pubsub.publish('COUNTER_UPDATED', { counterUpdated: count });
      return count;
    },
  },
  Subscription: {
    counterUpdated: {
      subscribe: () => {
        const asyncIterator = pubsub.asyncIterator('COUNTER_UPDATED');
        // Wrap the async iterator to yield an initial value.
        return withInitialValue(asyncIterator, { counterUpdated: count });
      },
    },
  },
};

// Custom async iterator that yields an initial value before any events.
async function* withInitialValue(asyncIterator, initialValue) {
  yield initialValue;
  while (true) {
    const next = await asyncIterator.next();
    if (next.done) break;
    yield next.value;
  }
}

// Create executable schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

async function startServer() {
  // Create Apollo Server instance with the explicit schema.
  const server = new ApolloServer({ schema });
  await server.start();
  server.applyMiddleware({ app });

  // Create an HTTP server.
  const httpServer = createServer(app);

  // Set up the subscription server with onOperation to inject the schema.
  SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect: (connectionParams, webSocket, context) => {
        const socketId = webSocket._socket.remoteAddress;
        subscribers.set(socketId, 'COUNTER_UPDATED');
        console.log(`Client connected: ${socketId}`);
        return { schema };
      },
      onOperation: (message, params, webSocket) => {
        return { ...params, schema };
      },
      onDisconnect: (webSocket, context) => {
        const socketId = webSocket._socket.remoteAddress;
        subscribers.delete(socketId);
        console.log(`Client disconnected: ${socketId}`);
      },
    },
    {
      server: httpServer,
      path: server.graphqlPath,
    }
  );

  const PORT = 4000;
  httpServer.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();
