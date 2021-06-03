const express = require('express');
const router = express.Router();

const locationsController = require('../controllers/Locations');
const mealtypesController = require('../controllers/MealTypes');
const restaurantsController = require('../controllers/Restaurants');
const usersController = require('../controllers/Users');
const paymentGatewayController = require('../controllers/PaymentGateway');


router.get('/locations',locationsController.getLocations);
router.post('/addlocation',locationsController.addLocation);
router.get('/mealtypes',mealtypesController.getMealtypes);
router.get('/restaurantsbylocation/:locationId',restaurantsController.getRestaurantsByLocation);
router.get('/restaurantbyid/:restaurantId',restaurantsController.getRestaurantDetailsById);
router.post('/filteredrestaurants',restaurantsController.filteredRestaurants);
router.post('/signup',usersController.addNewUser);
router.post('/signin',usersController.signinUser);
router.get('/menuitemsbyrestaurants/:restaurantId',restaurantsController.getMenuitemsByRestaurant);
router.post('/payment', paymentGatewayController.payment);
router.post('/callback', paymentGatewayController.callback);



module.exports = router;