const mongoose=require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt=require("bcryptjs");
const employeeSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    number:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:Number,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
});

// employeeSchema.pre("save", async function(next){
//         console.log(`the password is ${this.password}`);
//         this.password =await  bcrypt.hash(this.password, 10);
//     next();
// });



// generating token for register and login
employeeSchema.methods.generateAuthToken = async function(){
    try{
        const token= jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:token});
        console.log(token);
        await this.save();
        return token;
    }catch(err){
        res.send("error"+err);
        console.log("error part"+err);
    }
}




const User = new mongoose.model("User",employeeSchema);
module.exports=User;