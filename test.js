require("dotenv").config();
const axios = require("axios");
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);

const Restaurant = require("./models/Restaurant");

async function main() {
  const restau = await Restaurant.findById("638b9a34e413543a47d0f89c").populate(
    "nearbyPlaces"
  );
  console.log(restau);
}

main();
