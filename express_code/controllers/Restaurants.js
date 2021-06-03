const restaurantsData = require('../models/Restaurants');
const menuitemData = require('../models/Menuitems');


exports.getRestaurantsByLocation = (req, res) => {
    const loactionId = req.params.locationId;

    restaurantsData.find({ area: loactionId })
        .then(response => {
            res.status(200).json({ message: "Restaurants Fetched Successfully...", restaurants: response });
        })
        .catch(err => {
            res.status(500).json({ message: "Restaurants NOT Fetched Successfully...", error: err });
        })

}

exports.getRestaurantDetailsById = (req, res) => {
    const restaurantId = req.params.restaurantId;
    restaurantsData.findById(restaurantId)
        .then(response => {
            res.status(200).json({ message: "Restaurant Details Fetched Successfully...", restaurantdetails: response });
        })
        .catch(err => {
            res.status(500).json({ message: "Restaurant Details NOT Fetched Successfully...", error: err });
        })
}

exports.filteredRestaurants = (req, res) => {
    const reqBody = req.body;
    const locationId = reqBody.locationId;
    const mealtypeId = reqBody.mealtypeId;
    const cuisine = reqBody.cuisineId;
    const lcost = reqBody.lcost;
    const hcost = reqBody.hcost;
    const sort = reqBody.sort ? reqBody.sort : 1;
    const page = reqBody.page ? reqBody.page : 1;

    var payload = {};

    if (mealtypeId) {
        payload = {
            mealtype_id: mealtypeId
        }
    }
    if (mealtypeId && locationId) {
        payload = {
            mealtype_id: mealtypeId,
            area: locationId
        }
    }
    if (mealtypeId && lcost && hcost) {
        payload = {
            mealtype_id: mealtypeId,
            cost: { $lte: hcost, $gte: lcost }
        }
    }
    if (mealtypeId && locationId && lcost && hcost) {
        payload = {
            mealtype_id: mealtypeId,
            area: locationId,
            cost: { $lte: hcost, $gte: lcost }
        }
    }
    if (mealtypeId && cuisine) {
        payload = {
            mealtype_id: mealtypeId,
            cuisine: { $in: cuisine } 
        }
    }
    if (mealtypeId && locationId && cuisine) {
        payload = {
            mealtype_id: mealtypeId,
            area: locationId,
            cuisine: { $in: cuisine }
        }
    }
    if (mealtypeId && cuisine && lcost && hcost) {
        payload = {
            mealtype_id: mealtypeId,
            cuisine: { $in: cuisine },
            cost: { $lte: hcost, $gte: lcost }
        }
    }


    restaurantsData.find(payload).sort({ cost: sort })
        .then(response => {
            const itemsPerPage = 2;

            let startindex = (page * itemsPerPage - 2);
            let endindex = (page * itemsPerPage);
            let slicedArray = response.slice(startindex, endindex);

            res.status(200).json({ message: "Restaurants Fetched Successfully...", restaurants: slicedArray });
        })
        .catch(err => {
            res.status(500).json({ message: "Restaurants NOT Fetched Successfully...", error: err });
        })

}

exports.getMenuitemsByRestaurant = (req, res) => {
    const restaurantId = req.params.restaurantId;

    menuitemData.find({ restaurantId: restaurantId })
        .then(response => {
            res.status(200).json({ message: "MenuItems Fetched Successfully...", menuitems: response });
        })
        .catch(err => {
            res.status(500).json({ message: "MenuItems NOT Fetched Successfully...", error: err })
        })

}






