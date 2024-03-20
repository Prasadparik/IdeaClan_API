const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const schema = require("./src/graphql/schema");
const userResolvers = require("./src/graphql/userResolver");
const authMiddleware = require("./src/middleware/auth");

const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/social-media-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

// authentication middleware
app.use(authMiddleware);

// GraphQL endpoint
app.use(
  "/graphql",
  graphqlHTTP((req) => ({
    schema,
    rootValue: userResolvers,
    graphiql: true,
    context: { user: req.user },
  }))
);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
