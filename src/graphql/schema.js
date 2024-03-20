const { buildSchema } = require("graphql");

const schema = buildSchema(`
  type User {
    _id: ID!
    username: String!
    email: String!

  }

  type Post {
    _id: ID!
    title: String!
    content: String!
    author: User!
    createdAt: String!
  }

  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
  }

  type Query {
    getUser(userId: ID!): User
    getPost(postId: ID!): Post
    getAllPosts: [Post]
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): AuthData!
	login(usernameOrEmail: String!, password: String!): AuthData!
    createPost(title: String!, content: String!): Post
	
  }
`);

module.exports = schema;
