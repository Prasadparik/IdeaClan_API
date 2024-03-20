const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      next();
    } else {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) throw new Error("User not found");

      req.user = user;
      next();
    }
  } catch (error) {
    req.user = null; // Set to null if authentication fails
    return error;
  }
};

module.exports = authMiddleware;
