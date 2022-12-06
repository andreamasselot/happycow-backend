const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

const User = require("../models/User");
const isAuthenticated = require("../middlewares/isAuthenticated");

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

router.post("/user/signup", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const salt = uid2(16);
    const hash = SHA256(password + salt).toString(encBase64);
    const token = uid2(16);
    const emailExist = await User.find({ email });
    if (emailExist.length > 0) {
      return res.status(400).json({ message: "Email already exist" });
    } else if (!username) {
      return res.status(400).json({ message: "Missing parameters" });
    }

    const newUser = new User({
      email: email,
      token: token,
      hash: hash,
      salt: salt,
      account: {
        username: username,
      },
    });

    await newUser.save();
    res
      .status(200)
      .json({ _id: newUser._id, token: token, account: newUser.account });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email });
    const salt = user.salt;
    const hash = SHA256(password + salt).toString(encBase64);
    if (user.hash === hash && user.email === email) {
      res.json({ _id: user._id, token: user.token, account: user.account });
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/user/upload", isAuthenticated, fileUpload(), async (req, res) => {
  try {
    const pictureToUpload = req.files.picture;
    const result = await cloudinary.uploader.upload(
      convertToBase64(pictureToUpload)
    );
    req.user.account.avatar = result;
    await req.user.save();
    res.json({ message: "File Uploaded Successfully" });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

router.get("/users", async (req, res) => {
  try {
    const user = await User.find().select("account");
    console.log(user);
    res.json(user);
  } catch (error) {
    return res.json({ error: error.message });
  }
});

module.exports = router;
