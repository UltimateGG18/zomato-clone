const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const menuitemsSchema = Schema({
    name : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    ingredients : {
        type : Array,
        required : true
    },
    restaurantId : {
        type : String,
        required :true
    },
    image : {
        type : String,
        required : true
    },
    qty : {
        type : Number,
        required :true
    },
    price : {
        type : Number,
        required : true
    }
})

module.exports = mongoose.model('menuitem' , menuitemsSchema);