const jwt = require("jsonwebtoken");
const db = require("../database/db");

const protect = (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    db.get(
      `SELECT id, name, email FROM users WHERE id = ?`,
      [decoded.id],
      (err, user) => {
        if (err || !user) {
          return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
      }
    );
  } catch (error) {
    res.status(401).json({ message: "Token invalid" });
  }
};

module.exports = protect;
