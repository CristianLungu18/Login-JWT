const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const verifiyJWT = require("../middleware/verifiyJWT");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).render("home");
});

router.get("/login", (req, res) => {
  res.status(200).render("login");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const myUser = await User.findOne({ email });
  if (!myUser) {
    return res.status(404).redirect("/signup");
  }
  const isMatch = await bcrypt.compare(password, myUser.password);
  if (!isMatch) {
    return res.status(403).send("The password or email is incorrect!");
  }
  const accesToken = jwt.sign({ username: myUser.username }, "my_secret", {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(
    { username: myUser.username },
    "my_refresh_secret",
    {
      expiresIn: "1d",
    }
  );
  myUser.refreshTokens.push(refreshToken);
  await myUser.save();
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.json({ accesToken });
});

router.get("/signup", (req, res) => {
  res.status(200).render("signup");
});

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const myUser = await User.findOne({ email });
  if (myUser) {
    return res.status(200).redirect("/signup");
  }
  const hashPsw = await bcrypt.hash(password, 12);
  const newUser = new User({ username, email, password: hashPsw });
  await newUser.save();
  return res.status(200).redirect("/login");
});

router.get("/dashboard", verifiyJWT, (req, res) => {
  res.status(200).render("dashboard");
});
module.exports = router;
