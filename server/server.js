const express = require('express');
const path = require('path');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

// Create new server and install typeDefs and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Instantiate new Apollo Server
const startApolloServer = async () => {
  // Start the server
  await server.start();

  // Express body parsing middleware
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Configure GraphQL API playground endpoint
  app.use('/graphql', expressMiddleware(server));

  // Serve up React built when app is in production mode
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  // Connect to database and then start Express server
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// Start the Apollo server
startApolloServer();
