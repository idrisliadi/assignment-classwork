const mongoose = require("mongoose");
const UserfeedSchema = new mongoose.Schema({
    name : {
        type : String,
        require  : true
    },
    email :{
        type : String,
        required : true,
    },
    subject: {
        type : String,
        required : true,
    },
    Date : {
        type :Date,
        default :Date.now
    },
});
module.exports = mongoose.model("User", UserfeedSchemaUs)
    
