const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token = req.headers.authorization;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "Unauthorized, Invalid Token" });
    }
  } else {
    res.status(401).json({ message: "No Token Provided" });
  }
};

module.exports = protect;
