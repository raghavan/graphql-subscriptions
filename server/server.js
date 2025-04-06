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

// In-memory storage for the old and new counters.
let oldCounter = 0;
let newCounter = 0;

// Define GraphQL schema with separate fields for the two counters.
const typeDefs = gql`
  type Query {
    counter: Int!
    newCounter: Int!
  }

  type Mutation {
    incrementCounter: Int!
    incrementNewCounter: Int!
  }

  type Subscription {
    counterUpdated: Int!
    newCounterUpdated: Int!
  }
`;

const resolvers = {
  Query: {
    counter: () => oldCounter,
    newCounter: () => newCounter,
  },
  Mutation: {
    incrementCounter: () => {
      oldCounter++;
      pubsub.publish('COUNTER_UPDATED', { counterUpdated: oldCounter });
      return oldCounter;
    },
    incrementNewCounter: () => {
      newCounter++;
      pubsub.publish('NEW_COUNTER_UPDATED', { newCounterUpdated: newCounter });
      return newCounter;
    },
  },
  Subscription: {
    counterUpdated: {
      subscribe: () => {
        const asyncIterator = pubsub.asyncIterator('COUNTER_UPDATED');
        return withInitialValue(asyncIterator, { counterUpdated: oldCounter });
      },
    },
    newCounterUpdated: {
      subscribe: () => {
        const asyncIterator = pubsub.asyncIterator('NEW_COUNTER_UPDATED');
        return withInitialValue(asyncIterator, { newCounterUpdated: newCounter });
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

const schema = makeExecutableSchema({ typeDefs, resolvers });

async function startServer() {
  const server = new ApolloServer({ schema });
  await server.start();
  server.applyMiddleware({ app });

  const httpServer = createServer(app);

  SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect: (connectionParams, webSocket) => {
        const socketId = webSocket._socket.remoteAddress;
        console.log(`Client connected: ${socketId}`);
        return { schema };
      },
      onOperation: (message, params, webSocket) => ({ ...params, schema }),
      onDisconnect: (webSocket) => {
        const socketId = webSocket._socket.remoteAddress;
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
