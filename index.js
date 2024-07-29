// import all middlewares/dependencies
const express = require("express");
const mongoose = require("mongoose")
const server = express();
const cors = require("cors");
const multer = require("multer")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto") 
const session = require("express-session");
const path = require("path");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer")
const User = require("./Model/User")
const Userfeed = ("UserfeedSchema")
// const Admin = require("Model/Admin");
const cookieParser = require("cookie-parser");
dotenv.config();



//use middleware 
server.use(cors())
server.use(express.static(path.join(__dirname,"public")))
server.use(bodyParser.urlencoded({extended:false}));
server.use(cookieParser())
const secretKey = crypto.randomBytes(64).toString("hex");
server.use(
    session({
        secret :secretKey ,
        resave : false,
        saveUninitialized : true
    })
)
//set engine
server.set("views", path.join(__dirname,"views"))
server.set("view engine", "ejs");

//read the env
const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME
const connectDB = require("./config/dbcon");
connectDB();
const { register } = require("module");


//create a simple route
server.get("/registeruser",(req,res)=>{
    res.render("register")
})

server.post("/registeruser", async (req,res)=>{   
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const cpassword = req.body.cpassword;
    
    if(!name || !email || !password || !cpassword){
        return res.status(422).json({error: "please fill the data"})
    }const userExist = await User.findOne({email:email});
    if(userExist){
        return res.status(422).json({error :"user already exist"});
    }else{
        const hash = await bcrypt.hash(password, 10)
        const profile = {
            name : name,
            email :email,
            password : hash,
            cpassword : cpassword
        }
        const feed = await User.create(profile);
        //send mail
      const delivered= main("liadiidris22@gmail.com",email);
      if (delivered){
        res.status(201).json({message : "user registered successfully",
         status : "mail deliveredd successfully"
});
console.log(feed);
      }else{
        res.status(500).json({error :"something went wrong"})
      }
    }
})
server.get("/contact", (req,res)=>{
    res.render("contact")
})

server.get("/about",(req,res)=>{
    res.render("about")
})

server.get("/blog",(req,res)=>{
    res.render("blog")
})
server.get("/project-details",(req,res)=>{
    res.render("project-details")
})
server.get("/projects",(req,res)=>{
    res.render("project")
})
server.get("/services",(req,res)=>{
    res.render("services")
})
server.get("/starter-page",(req,res)=>{
    res.render("starter-page")
})

//submit feedback from user
server.post("/contact", async (req,res)=>{
    console.log(req.body)
    // const name = req.body.name.trim()
    // const email = req.body.email.trim();
    // const message = req.body.message.trim();
    // if (!name || email || !message){
    //     return res.status(422).json({error : "please fill the data"});
    // }
    // const feed = await Userfeed.create({
    //     name : name,
    //     email : email,
    //     message : message
    // });
    // return jsonify({name : name, email :email})
    // res.status(201).json({message :"feedback submitted succesfully"})
})
//admin 
server.get("/admin",(req,res)=>{
    res.render("admindash/indexx")
})
//load the user page
server.get("/users", (req,res)=>{
    res.render("index")
})
    const apppwd= process.env.APP_PWD
//send mail code
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "liadiidris22@gmail.com",
      pass: apppwd,
    },
  });
  
  // async..await is not allowed in global scope, must use a wrapper
  async function main(senderemail, receiveremail,) {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"idris site" ${senderemail}`, // sender address
      to: `${receiveremail}`,
       // list of receivers
      subject: "registration succesfull", // Subject line
      text: "thank you for registering to idris website,feel free to navigate through our page", // plain text body
     // html: "<b>Hello world?</b>", // html body
    });
  
    
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }

//end mail


//login route 
server.get("/login", (req, res)=>{
    res.render("login");
})
server.post("/login", async(req, res)=>{
    const password = req.body.password.trim();
    const email = req.body.email.trim();
    if(password.length == 0 || email.length == 0){
        res.send("fill the required field")
    }
    const profile = {
        password:password,
        email:email
    }
    // generate token for user
    jwt.sign(profile, secretKey, (error, token)=>{
        if(error){
            res.send("validation issues")
        }else{
            req.session.secretKey = secretKey
            req.session.token = token
            res.cookie("usertoken", token)
            if(res.cookie("usertoken")){
                res.redirect("dash")
            }else{
                res.send("invalid")
                // res.render("login")
            }
            
        }

    })
})

//create a database connection
const db = mongoose.connection;
//connectto database
db.once("open", ()=>{
    console.log("connected to database");
    server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
    })
})
//closedatabas conns
db.on("close" ,()=>{
    console.log("connection close");
})
//0ld dashboard route
server.get("/dash", (req, res)=>{
    // 
           res.render("dash")
        })

//upload to multer
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, "public/images/")
    },
    filename: (req, file, cb)=>{
        cb(null, file.originalname)
    }
})
// activate multer storage setting
const upload = multer({storage: storage})
server.post("/uploader", upload.single('file1'), (req, res, next)=>{
    const img = req.file.originalname
    const imgsize = req.file.size
    const img_title = req.body.imgTitle
    const img_desc = req.body.img_desc
    res.send("upload successfull")

})

// server.get("/", (req, res)=>{
//     res.send("hello world")
// });

