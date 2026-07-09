const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    fullname : {
        type : String,
        trim : true,
        minLength : 3
    },
    email : {
        type : String,
        unique : true
    },
    password : {
        type : String,
        minLength : 6
    },
    cart :{
        type : Array,
        default : []
    },
    isadmin : Boolean,
    order : {
        type : Array,
        default : []
    },
    contact : Number,
    picture : String
});

module.exports = mongoose.model("user",userSchema);