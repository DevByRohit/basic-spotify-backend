const jwt = require("jsonwebtoken");

// Middleware to authenticate artists before allowing access to certain routes
const authArtist = (req, res, next) => {
  // Get the token from the cookies
  const token = req.cookies.token;

  // If no token is provided, return an unauthorized error
  if (!token) {
    return res.status(401).send("Unauthorized: No token provided");
  }

  // Verify the token and check if the user is an artist
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "artist") {
      return res
        .status(403)
        .send("Forbidden: Only artists can access this resource");
    }

    // create a user object and attach it to the request
    req.user = decoded;

    // If the token is valid and the user is an artist, proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).send("Unauthorized: Invalid token");
  }
};

// Middleware to authenticate normal users before allowing access to certain routes
const authUser = (req, res, next) => {
  // Get the token from the cookies
  const token = req.cookies.token;

  // If no token is provided, return an unauthorized error
  if (!token) {
    return res.status(401).send("Unauthorized: No token provided");
  }
  // Verify the token and check if the user is a normal user
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "user") {
      return res
        .status(403)
        .send("Forbidden: Only normal users can access this resource");
    }
    // create a user object and attach it to the request
    req.user = decoded;

    // If the token is valid and the user is a normal user, proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).send("Unauthorized: Invalid token");
  }
};

module.exports = { authArtist, authUser };
