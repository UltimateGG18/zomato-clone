const mongoose = require('mongoose');
const schema = mongoose.Schema;

const usersSchema = schema ({
    name : {
        type : String ,
        required : true
    },
    email : {
        type : String ,
        required : true
    },
    mobile : {
        type : Number ,
        required : true
    },
    password : {
        type : String ,
        required : true
    }
})

module.exports = mongoose.model('user',usersSchema);