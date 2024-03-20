
# GraphQL API with Apollo Server

## Prerequisites

Before running the API, make sure you have the following installed on your machine:

- Node.js
- MongoDB Atlas account (or a local MongoDB server)
- Git (optional, for cloning the repository)

## Setup

1. Clone this repository to your local machine using Git:
2. Navigate to the project directory.
3. Install the dependencies using npm.
   ```bash
   npm install
   ```

## Configuration

1. Open the `.env` file and update the `MONGODB_URL` variable with your MongoDB connection string.

## Starting the Server

1. Start the MongoDB server
2. Run the following command to start the API server:

   ```bash
   npm start
   ```

   This will start the server and connect to the MongoDB database.

3. Once the server is running, you should see a message in the console saying "Server running on port 3000".

---

## Interacting with the API

You can interact with the API using GraphQL queries and mutations at [http://localhost:3000/graphql](http://localhost:3000/graphql).

### Create User

```graphql
mutation {
  createUser(username: "your-username", email: "your-email@example.com", password: "your-password") {
    userId
    token
    tokenExpiration
  }
}
```

Replace `"your-username"`, `"your-email@example.com"`, and `"your-password"` with your desired values.

### Login

```graphql
mutation {
  login(usernameOrEmail: "your-username", password: "your-password") {
    userId
    token
    tokenExpiration
  }
}
```

Replace `"your-username"` and `"your-password"` with your actual credentials.

### Create Post

**Note:** Set header `Authorization: token` before making this mutation.

```graphql
mutation {
  createPost(title: "Your Post Title", content: "Your post content goes here.") {
    _id
    title
    content
    author {
      _id
      username
      email
    }
    createdAt
  }
}
```

Replace `"Your Post Title"` and `"Your post content goes here."` with your desired post details.

### Additional Notes

- Make sure to handle authentication tokens securely in a production environment.

---
