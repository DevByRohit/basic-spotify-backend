const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcript = require("bcryptjs");

// API to register a new user
const registerUser = async (req, res) => {
  // Extract username, email, password, and role from the request body
  const { username, email, password, role = "user" } = req.body;

  // Check if a user with the same username or email already exists in the database
  const isUserExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  // If a user already exists, return a conflict error response
  if (isUserExists) {
    return res.status(409).json({ message: "User already exits" });
  }

  // Hash the password using bcrypt before storing it in the database
  const hashedPassword = await bcript.hash(password, 10);

  // Create a new user in the database with the provided username, email, hashed password, and role
  const user = await userModel.create({
    username,
    email,
    password: hashedPassword,
    role,
  });

  // Generate a JWT token with the user's ID and role as the payload, and sign it with the secret key from the environment variables
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
  );

  // Set the generated JWT token in a cookie named "token" in the response
  res.cookie("token", token);

  // Return a success response with the user data and a message indicating that the user was registered successfully
  res.status(201).json({
    message: "User registered successfully",
    user,
  });
};

// API to log in an existing user
const loginUser = async (req, res) => {
  // Extract username, email, and password from the request body
  const { username, email, password } = req.body;

  // Check if user exists with the provided username or email
  const user = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  // If user does not exist, return an error
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Compare the provided password with the stored hashed password
  const isPasswordValid = await bcript.compare(password, user.password);

  // If the password is invalid, return an error
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate a JWT token with the user's ID and role
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
  );

  // Set the token in a cookie
  res.cookie("token", token);

  // Return a success response with the user data
  res.status(200).json({
    message: "User logged in successfully",
    user,
  });
};

module.exports = {
  registerUser,
  loginUser,
};
