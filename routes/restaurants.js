const axios = require("axios");
const express = require("express");
const router = express.Router();

router.get("/restaurants", async (req, res) => {
  try {
    const response = await axios.get(
      `https://res.cloudinary.com/lereacteur-apollo/raw/upload/v1575242111/10w-full-stack/Scraping/restaurants.json`
    );
    if (req.query.name) {
      const result = response.data.filter((elem) => {
        return elem.name.toLowerCase().includes(req.query.name.toLowerCase());
      });
      res.json(result);
      return;
    }

    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
