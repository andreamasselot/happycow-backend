const mongoose = require("mongoose");

const Restaurant = mongoose.model("Restaurant", {
  placeId: mongoose.Schema.Types.ObjectId,
  name: String,
  address: String,
  location: { lng: Number, lat: Number },
  phone: String,
  thumbnail: String,
  type: String,
  category: Number,
  rating: Number,
  vegan: Number,
  vegOnly: Number,
  link: String,
  description: String,
  pictures: [String],
  price: String,
  website: String,
  facebook: String,
  nearbyPlaces: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
    },
  ],
});

module.exports = Restaurant;
