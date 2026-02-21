const jwt = require("jsonwebtoken");
const User = require('../modules/users/user.model');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Support both token payload styles: { id } OR { userId }
    const userId = decoded.id || decoded.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = await User.findById(userId).select("-password");

    // ✅ If user not found in DB
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    next();
  } catch (error) {
    console.error(`Auth middleware error: ${error.message}`);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = { protect }