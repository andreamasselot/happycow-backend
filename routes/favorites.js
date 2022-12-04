require("dotenv").config();
const express = require("express");
const router = express.Router();

const Favorite = require("../models/Favorite");
const User = require("../models/User");
const isAuthenticated = require("../middlewares/isAuthenticated");
const Restaurant = require("../models/Restaurant");

router.get("/favorites", isAuthenticated, async (req, res) => {
  try {
    const favorite = await Favorite.find({
      owner: req.user._id,
    }).populate("restaurant");
    res.json(favorite);
  } catch (error) {
    res.status(400).json({ error: "Not Found" });
  }
});

router.post("/favorites/create", isAuthenticated, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.body.placeId);
    if (!restaurant) {
      return res.status(400).json({ error: "Restaurant not found" });
    }
    const exist = await Favorite.findOne({
      restaurant: req.body.placeId,
      owner: req.user._id,
    });
    if (exist) {
      return res.status(400).json({ error: "Favorite already exist" });
    }
    const favorite = new Favorite({
      owner: req.user._id,
      restaurant: req.body.placeId,
    });
    await favorite.save();
    res.json(favorite);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/favorites/delete", isAuthenticated, async (req, res) => {
  try {
    const favorite = await Favorite.findById(req.body._id);
    if (!favorite) {
      return res.status(400).json({ error: "Not Found" });
    }
    await favorite.delete();
    res.json({ message: "successfully deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
