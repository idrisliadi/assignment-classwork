const mongoose = require("mongoose");
const connetDB = async () =>{
    try{
        //mongodb connecttion
     const connDB = await   mongoose.connect(process.env.DB_URL,{
            useNewUrlParser : true,
            useUnifiedTopology : true,
        });

    }catch(error){
        console.log("connection error" + error);
    }
}
module.exports = connetDB