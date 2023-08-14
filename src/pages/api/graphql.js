// src/pages/api/graphql.js

import { ApolloServer, gql } from "apollo-server-micro";
import connectDB from "@/utils/db";
import { ObjectId } from "mongodb";

const typeDefs = gql`
  type User {
    _id: String!
    firstName: String!
    lastName: String!
    email: String!
  }

  type Query {
    getUsers: [User]
  }

  type Mutation {
    addUser(firstName: String!, lastName: String!, email: String!): User
    deleteUser(_id: String!): Boolean
    updateUser(
      _id: String!
      firstName: String
      lastName: String
      email: String
    ): User
  }
`;

const resolvers = {
  Query: {
    getUsers: async () => {
      try {
        const db = await connectDB();
        const collection = db.collection("userdata");
        const userData = await collection.find().toArray();
        return userData;
      } catch (error) {
        console.error("Error retrieving user data:", error);
        return [];
      }
    },
  },
  Mutation: {
    addUser: async (_, args) => {
      try {
        const db = await connectDB();
        const collection = db.collection("userdata");
        const { firstName, lastName, email } = args;
        const newUser = {
          firstName,
          lastName,
          email,
        };
        const result = await collection.insertOne(newUser);
        newUser._id = new ObjectId(result.insertedId);
        return newUser;
      } catch (error) {
        console.error("Error inserting user data:", error);
        throw new Error("Error inserting user data");
      }
    },
    deleteUser: async (_, args) => {
      try {
        const db = await connectDB();
        const collection = db.collection("userdata");
        const result = await collection.deleteOne({
          _id: new ObjectId(args._id),
        });
        return result.deletedCount === 1;
      } catch (error) {
        console.error("Error deleting user data:", error);
        return false;
      }
    },
    updateUser: async (_, args) => {
      try {
        const db = await connectDB();
        const collection = db.collection("userdata");
        const { _id, firstName, lastName, email } = args;

        const updateFields = {};
        if (firstName) updateFields.firstName = firstName;
        if (lastName) updateFields.lastName = lastName;
        if (email) updateFields.email = email;

        const result = await collection.findOneAndUpdate(
          { _id: new ObjectId(_id) },
          { $set: updateFields },
          { returnOriginal: false }
        );

        if (!result.value) {
          throw new Error("User not found");
        }
        return result.value;
      } catch (error) {
        console.error("Error updating user data:", error);
        throw new Error("Error updating user data");
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default server.createHandler({ path: "/api/graphql" });
