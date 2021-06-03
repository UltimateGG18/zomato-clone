const mongoose = require('mongoose');

const schema = mongoose.Schema;

const restaurantSchema = schema({
    name : {
        type : String,
        required : true
    },
    city_name : {
        type : String,
        required : true
    },
    city : {
        type : Number,
        required : true
    },
    area : {
        type : Number,
        required : true
    },
    locality : {
        type : String,
        required : true
    },
    thumb : {
        type : Array,
        required : true
    },
    cost : {
        type : Number,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    Contact : { 
        type : Number,
        required : true
    },
    mealtype_id : {
        type : Number,
        required : true
    },
    cuisine : {
        type : Array,
        required : true
    },
    cuisineName : {
        type : Array,
        required : true
    },
    average_rating : {
        type : Number,
        required : true
    }
})

module.exports = mongoose.model('restaurant',restaurantSchema);