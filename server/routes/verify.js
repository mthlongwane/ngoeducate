const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
  let token = req.header("Authorization");
  if (!token) {
    return res.status(200).send({ message: "Token not found" });
  }

  token = token.split("Bearer")[1].trim();

  try {
    const verified = jwt.verify(token, tokenSecret);
    req.verify = verified;
    next();
  } catch (err) {
    res.status(400).send({ message: "Invalid token" });
  }
};
