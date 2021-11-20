const router = require("express").Router();
const uuid = require("uuid");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const { User } = require("../models");

router.post("/login", async (req, res) => {
  let { username, countryCode, password } = req.body;

  if (username.startsWith("0")) {
    username = username.substring(1, username.length);
  }

  countryCode = countryCode.replace("+", "");

  let user;
  user = await User.findOne({
    where: { mobile: username, countryCode: countryCode },
  });

  if (user) {
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ uid: user.uid }, tokenSecret, {
        expiresIn: "365d",
      });
      return res.status(200).send({ message: "", token: token });
    }
    return res.status(203).send({ message: "Incorrect username or password" });
  }

  return res.status(203).send({ message: "Invalid credentials!" });
});

router.post("/register", async (req, res) => {
  let { name, email, password, mobile, countryCode } = req.body;

  if (mobile.startsWith("0")) {
    mobile = mobile.substring(1, mobile.length);
  }

  countryCode = countryCode.replace("+", "");

  if (await User.findOne({ where: { mobile: mobile } })) {
    return res
      .status(203)
      .send({ message: "This mobile number is already registered!" });
  }
  if (email && (await User.findOne({ where: { email: email } }))) {
    return res
      .status(203)
      .send({ message: "This email is already registered!" });
  }

  const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));

  if (mobile && countryCode && password) {
    let newUser = await User.create({
      uid: uuid.v4(),
      name: name,
      email: email,
      mobile: mobile,
      countryCode: countryCode,
      password: hashedPassword,
    });
    return res.status(200).send({
      message: "Registration completed!",
      data: {
        uid: newUser.uid,
        name: newUser.name,
      },
    });
  }

  return res.status(203).send({ message: "Registration error!" });
});

module.exports = router;
