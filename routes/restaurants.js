const axios = require("axios");
const express = require("express");
const Restaurant = require("../models/Restaurant");
const router = express.Router();

router.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await Restaurant.find({
      name: new RegExp(req.query.name, "i"),
    });

    res.json(restaurants);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/restaurants/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const restaurant = await Restaurant.findById(id).populate("nearbyPlaces");
    if (!restaurant) {
      return res.status(400).json({ error: "Not Found" });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
