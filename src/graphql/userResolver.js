// resolvers/userResolver.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Post = require("../models/Post");

const userResolver = {
  getUser: async ({ userId }) => {
    try {
      const user = await User.findById(userId);
      return user;
    } catch (error) {
      throw new Error("User not found");
    }
  },

  createUser: async ({ username, email, password }) => {
    try {
      // Checking if the email is already in use
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log("existingUser IN RESOLVE >>", existingUser);
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

      console.log("user IN RESOLVE >>", user);

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" } // Token expiration time
      );
      console.log("TOKEN IN RESOLVE >>", token);

      return {
        userId: user._id,
        token: token,
        tokenExpiration: 1,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  login: async ({ usernameOrEmail, password }) => {
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
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return {
      userId: user.id,
      token: token,
      tokenExpiration: 1,
    };
  },

  createPost: async ({ title, content }, { user }) => {
    if (!user) {
      throw new Error("Authentication required");
    }

    try {
      const post = new Post({ title, content, author: user });
      await post.save();
      console.log("NEW POST IN RESOLVER >>", { title, content, author: user });

      // Update the users posts array with new post ID
      await User.findByIdAndUpdate(user.id, { $push: { posts: post.id } });

      console.log("User's posts array updated");

      return post;
    } catch (error) {
      console.error("Error creating post:", error);
      throw new Error("Failed to create post");
    }
  },
};

module.exports = userResolver;
