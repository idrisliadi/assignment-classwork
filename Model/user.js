const { name } = require("ejs");
const mongoose = require ("mongoose");
const Userschema = new mongoose.Schema({
    name : {
        type : String,
        require  : true
    },
    email :{
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    Date : {
        type :Date,
        default :Date.now
    },
});
module.exports = mongoose.model("User", Userschema)