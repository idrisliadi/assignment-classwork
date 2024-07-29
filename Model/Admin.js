const { name } = require("ejs");
const mongoose = require ("mongoose");
const Adminschema = new mongoose.Schema({
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
module.exports = mongoose.model("Admin", Adminschema)