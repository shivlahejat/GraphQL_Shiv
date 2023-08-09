//src/pages/api/graphql.js

import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { gql } from "graphql-tag";

const users = [];

const typeDefs = gql`
  type Query {
    user(userId: Int): User
    allUsers: [User]
  }

  type Mutation {
    createUser(input: UserInput): User
  }

  input UserInput {
    firstName: String
    lastName: String
    email: String
  }

  type User {
    userId: Int
    firstName: String
    lastName: String
    email: String
  }
`;

const resolvers = {
  Query: {
    user(parent, args, contextValue, info) {
      return users.find((user) => user.userId === args.userId);
    },
    allUsers() {
      return users;
    },
  },
  Mutation: {
    createUser(parent, args, contextValue, info) {
      const newUser = {
        userId: users.length + 1,
        ...args.input,
      };
      users.push(newUser);
      return newUser;
    },
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

export default startServerAndCreateNextHandler(apolloServer);
