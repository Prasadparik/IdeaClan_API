const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Post = require("../models/Post");

const resolvers = {
  Query: {
    getUser: async (_, { userId }) => {
      try {
        const user = await User.findById(userId);
        return user;
      } catch (error) {
        throw new Error("User not found");
      }
    },
    getPost: async (_, { postId }) => {
      try {
        const post = await Post.findById(postId);
        return post;
      } catch (error) {
        throw new Error("Post not found");
      }
    },
    getAllPosts: async () => {
      try {
        const posts = await Post.find();
        return posts;
      } catch (error) {
        throw new Error("Failed to fetch posts");
      }
    },
  },
  Mutation: {
    createUser: async (_, { username, email, password }) => {
      try {
        // Checking if the email is already in use
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error("Email is already in use");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const user = new User({
          username,
          email,
          password: hashedPassword,
        });
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
          { userId: user._id, username: user.username },
          process.env.JWT_SECRET,
          { expiresIn: "1h" } // Token expiration time
        );

        return {
          userId: user._id,
          token: token,
          tokenExpiration: 1,
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },
    login: async (_, { usernameOrEmail, password }) => {
      try {
        const user = await User.findOne({
          $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        });
        if (!user) {
          throw new Error("User not found");
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          throw new Error("Invalid password");
        }

        const token = jwt.sign(
          { userId: user._id, username: user.username },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        return {
          userId: user._id,
          token: token,
          tokenExpiration: 1,
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    createPost: async (_, { title, content }, { user }) => {
      try {
        if (!user || !user._id || !user.username) {
          throw new Error("Authentication required");
        }

        // Create a new post
        const post = new Post({
          title,
          content,
          author: {
            _id: user._id,
            username: user.username,
          },
          createdAt: new Date().toISOString(),
        });

        // Save the post to the database
        await post.save();

        // Update the user's posts array with the new post ID
        await User.findByIdAndUpdate(user.id, { $push: { posts: post.id } });

        // Fetch the newly created post from the database
        const createdPost = await Post.findById(post._id).populate("author");

        return createdPost; // Return the created post as a response
      } catch (error) {
        throw new Error("Failed to create post: " + error.message);
      }
    },
  },
};

module.exports = resolvers;
