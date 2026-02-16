const { gql } = require('apollo-server-express');
const users = require('../data/users.data');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    users: [User]
    user(id: ID!): User
  }

  type Mutation {
    createUser(name: String!, email: String!): User
    updateUser(id: ID!, name: String, email: String): User
    deleteUser(id: ID!): User
  }
`;

const resolvers = {
    Query: {
        users: () => users,
        user: (_, { id }) => users.find(u => u.id == id)
    },
    Mutation: {
        createUser: (_, { name, email }) => {
            const id = Date.now();
            const newUser = { id, name, email };
            users.push(newUser);
            return newUser;
        },
        updateUser: (_, { id, name, email }) => {
            const user = users.find(u => u.id == id);
            if (!user) return null;
            if (name) user.name = name;
            if (email) user.email = email;
            return user;
        },
        deleteUser: (_, { id }) => {
            const index = users.findIndex(u => u.id == id);
            if (index === -1) return null;
            const [deleted] = users.splice(index, 1);
            return deleted;
        }
    }
};

module.exports = { typeDefs, resolvers };
