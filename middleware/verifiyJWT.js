const jwt = require("jsonwebtoken");

const verifiyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.sendStatus(401);
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, "my_secret", (err, decoded) => {
    if (err) {
      return res.status(403).json({ msg: err });
    }
    req.user = decoded.username;
    next();
  });
};

module.exports = verifiyJWT;
