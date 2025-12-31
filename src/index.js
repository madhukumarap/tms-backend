const { createServer } = require('@graphql-yoga/node');
const { resolvers } = require('./resolvers');
const typeDefs = require('./schema/schema');
const { verifyToken } = require('./auth/auth');
require('dotenv').config();

const allowedOrigins = [
  'http://localhost:3000',
  'https://tms-system-lx7x.vercel.app',
];

const server = createServer({
  schema: {
    typeDefs,
    resolvers,
  },
  context: ({ request }) => {
    const token = request.headers.get('authorization') || '';
    let user = null;

    if (token) {
      try {
        user = verifyToken(token.replace('Bearer ', ''));
      } catch (error) {
        user = null;
      }
    }

    return { user };
  },
  cors: {
    origin: (origin) => {
      // allow requests with no origin (like Postman / server-to-server)
      if (!origin) return true;
      return allowedOrigins.includes(origin);
    },
    credentials: true,
  },
});

server.start().then(() => {
  console.log(`🚀 Server running on http://localhost:4000/graphql`);
});
