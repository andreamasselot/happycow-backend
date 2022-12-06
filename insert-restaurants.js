require("dotenv").config();
const axios = require("axios");
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);

const Restaurant = require("./models/Restaurant");

const main = async () => {
  const response = await axios.get(
    "https://res.cloudinary.com/lereacteur-apollo/raw/upload/v1575242111/10w-full-stack/Scraping/restaurants.json"
  );

  const myRestaurantsWithId = response.data.map((restaurant) => {
    return {
      _id: new mongoose.Types.ObjectId(),
      ...restaurant,
    };
  });

  const restaurantsWithRelationShips = myRestaurantsWithId.map((restaurant) => {
    const nearbyPlacesIds = [];
    restaurant.nearbyPlacesIds.forEach((placeId) => {
      const nearbyPlace = myRestaurantsWithId.find(
        (r) => r.placeId === placeId
      );
      if (!nearbyPlace) {
        return;
      }
      nearbyPlacesIds.push(nearbyPlace._id);
    });

    // copy restaurant but rename/delete properties
    const newRestaurant = {
      ...restaurant,
      placeId: restaurant._id,
      nearbyPlaces: nearbyPlacesIds,
    };
    delete newRestaurant.nearbyPlacesIds;
    return newRestaurant;
  });

  await Promise.all(
    restaurantsWithRelationShips.map(async (restaurant) => {
      const dbRestaurant = new Restaurant({ ...restaurant });
      return dbRestaurant.save();
    })
  );
};

main();
