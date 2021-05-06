const jwt=require("jsonwebtoken");
const User=require("../models/register");

const auth= async (req,res,next)=>{
    try{

        const token = req.cookies.jwt;
        const verifyUser= jwt.verify(token, process.env.SECRET_KEY);
        console.log(verifyUser);

       const user =await  User.findOne({_id:verifyUser._id});
       console.log(user);

        req.token=token;
        req.user=user;
        next();

    }catch(err){
        res.status(400).send("plz firt <h1>register</h1> and then <h1>login</h1> ");
    }
}
module.exports = auth;