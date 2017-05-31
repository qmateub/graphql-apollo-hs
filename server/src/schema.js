// Welcome to Launchpad!
// Log in to edit and save pads, run queries in GraphiQL on the right.
// Click "Download" above to get a zip with a standalone Node.js server.
// See docs and examples at https://github.com/apollographql/awesome-launchpad

// graphql-tools combines a schema string with resolvers.
import { makeExecutableSchema } from 'graphql-tools';
import fetch from 'node-fetch';

// Construct a schema, using GraphQL schema language
const typeDefs = `
	type Card {
		cardId: String
		name: String
		img: String
	}
  type Query {
    hello: String
		cards: [Card!]
		searchCard(name: String!): [Card!]
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: (root, args, context) => {
      console.log(root, args, context)
      return 'Hello world!';
    },
    searchCard: (root, args, context) => {
      return fetch('https://omgvamp-hearthstone-v1.p.mashape.com/cards/search/'+args.name+'?locale=esES', {
        method: 'GET',
        headers: {
          "X-Mashape-Key":"uVvx1uG9VFmshtQoxBYJlBPZEJ9Zp1bffzxjsnohd9c8lMZfnc",
          "Accept":"application/json",
        }
      })
      .then(function(res) {
          return res.json();
      }).then(function(json) {
          return json
      });
    },
    cards: (root, args, context) => {
      return fetch('https://omgvamp-hearthstone-v1.p.mashape.com/cards/Ysera', {
        method: 'GET',
        headers: {
          "X-Mashape-Key":"uVvx1uG9VFmshtQoxBYJlBPZEJ9Zp1bffzxjsnohd9c8lMZfnc",
          "Accept":"application/json",
        }
      })
      .then(function(res) {
          return res.json();
      }).then(function(json) {
          return json
      });
    }
  },
};

// Required: Export the GraphQL.js schema object as "schema"
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Optional: Export a function to get context from the request. It accepts two
// parameters - headers (lowercased http headers) and secrets (secrets defined
// in secrets section). It must return an object (or a promise resolving to it).
export function context(headers, secrets) {
  return {
    headers,
    secrets,
  };
};

// Optional: Export a root value to be passed during execution
// export const rootValue = {};
