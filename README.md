# GraphQL Real-Time Counter App

This repository contains a real-time counter application built with GraphQL subscriptions. It consists of two parts:

- **Server:** A Node.js backend using Apollo Server, GraphQL, and subscriptions to manage and broadcast counter updates.
- **Client:** A React frontend using Apollo Client and React Router that lets users view real-time counter updates and increment the counter.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
  - [Server Setup](#server-setup)
  - [Client Setup](#client-setup)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- npm (comes with Node.js)

## Folder Structure

```plaintext
/ (root)
│
├── README.md
│
├── server
│   ├── package.json
│   └── server.js
│
└── client
    ├── package.json
    └── src
        ├── index.js
        ├── ViewCounter.js
        └── CountButton.js
```

## Installation

### Server Setup

1. **Navigate to the server folder:**
   ```bash
   cd server
   ```

2. **Install dependencies:**  
   If you face dependency conflicts, try using the legacy-peer-deps flag.
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the server:**
   ```bash
   node server.js
   ```
   The server will run on [http://localhost:4000/graphql](http://localhost:4000/graphql) and supports GraphQL queries, mutations, and subscriptions.

### Client Setup

1. **Open a new terminal and navigate to the client folder:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the React app:**
   ```bash
   npm start
   ```
   The client will run on [http://localhost:3000](http://localhost:3000).

## Usage

- **View Real-Time Counter:**
  - Open your browser and navigate to [http://localhost:3000/view](http://localhost:3000/view).
  - This page subscribes to the `counterUpdated` event and will display the current counter value in real time.

- **Increment the Counter:**
  - Navigate to [http://localhost:3000/count](http://localhost:3000/count).
  - Click the "Increment Counter" button to trigger a mutation on the backend.
  - The mutation updates the in-memory counter and publishes the new value, which then updates all subscribed clients.

## Troubleshooting

- **GraphQL Subscription Errors:**
  - If you see errors like "Missing schema information" or null payloads, ensure that your server is correctly providing the schema to the SubscriptionServer.
  - Check your server logs and console output on the client side (especially with the added logging in your **ViewCounter.js**).

- **Dependency Issues:**
  - If there are issues with `graphql-subscriptions` (e.g., asyncIterator not being a function), verify the installed version.  
  - For CommonJS compatibility, consider downgrading to a version that supports CommonJS (e.g., `graphql-subscriptions@1.2.1`) using:
    ```bash
    npm install graphql-subscriptions@1.2.1 --legacy-peer-deps
    ```
  - Alternatively, switch your project to ESM modules by setting `"type": "module"` in your **package.json** and using `import` statements.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve this project.

## License

This project is licensed under the MIT License.
