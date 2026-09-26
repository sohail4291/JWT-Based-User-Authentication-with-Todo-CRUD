const jwt = require("jsonwebtoken");
const cookie = require("cookie");

function authmiddleware(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(203).send({ message: "You are not logged in" });
  }

  const decoded = jwt.verify(token, "my-secret-key");
  const username = decoded.username;
  console.log("decoded : ", username);

  if (!username) {
    res.status(403).json({ message: 'malformed token' });
  }
  req.username = username;
  next();

}

module.exports = { authmiddleware };