require('dotenv').config(); 
const bcrypt=require("bcryptjs");
const path=require("path");
const hbs=require("hbs");
const express=require("express");
const app=new express();
const port= process.env.PORT||80;
const auth = require("./middleware/auth");

require("./db/conec");
const User=require("./models/register");
const cookieParser = require('cookie-parser');


const staticpath=path.join(__dirname,"../public");
const templatepath=path.join(__dirname,"../templates/views");
const partialspath=path.join(__dirname,"../templates/partials");

app.use(cookieParser());
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(express.static(staticpath));
app.set("views",templatepath);
app.set("view engine","hbs");
hbs.registerPartials(partialspath);





app.get("/",(req,res)=>{
    res.render("index");
})
app.get("/about", auth ,(req,res)=>{
    // console.log(`${req.cookies.jwt} this is the cookie`); 
    res.render("about");
})
app.get("/services",(req,res)=>{
    res.render("services");
})
app.get("/register",(req,res)=>{
    res.render("register");
})
app.get("/login",(req,res)=>{
    res.render("login");
})


app.get("/logout",auth,async(req,res)=>{
    try{    
        // req.user.tokens=[];
        req.user.tokens=req.user.tokens.filter((currElement)=>{
                return currElement.token!==req.token;
        })

        res.clearCookie("jwt");  
            console.log("logout");

          await  req.user.save();
          res.render("login");

    }catch(err){
        res.status(500).send(err);
    }
})



app.post("/register",async(req,res)=>{
    try{
        const data= new User(req.body);


                 const token =await data.generateAuthToken();
                console.log(`the token part =`+token);

                 res.cookie("jwt",token,{
                 expires:new Date(Date.now()+600000),
                 httpOnly:true
                  });

         const result= await data.save();
         res.render("login");


    }catch(err){
        res.status(400).send(`error`);
    }
})

app.post("/login",async(req,res)=>{
    try{
        const email=req.body.email;
        const password=req.body.password;
        const useremail=await User.findOne({email:email});
        

        
        const token =await useremail.generateAuthToken();
        console.log(`the token part =`+token);


        res.cookie("jwt",token,{
            expires:new Date(Date.now()+600000),
            httpOnly:true
        });
    



        if(useremail.password==password){
            res.render("index");
        }else{
            res.send("invalid details");
        }
    }catch(err){
        res.status(400).send("<h1>First Register</h1>");
    }
})








app.listen(port,()=>{
    console.log(`listinig on the port ${port}`);
})