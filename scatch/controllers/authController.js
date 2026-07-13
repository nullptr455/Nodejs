const userModel = require("../models/user-model");
const { hash } = require("bcrypt");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { generateToken } = require("../utils/generateToken")


module.exports.registerUser = (req, res) => {

    try {
  let { fullname, email, password } = req.body;
   
    bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(password,salt, async (err,hash)=>{
         if(err){
            return res.status(500).send("there are error");
         }else{
            
            const user = await userModel.create({
              fullname,
              email,
              password : hash,
            });
         const token = generateToken(user);
         res.cookie("token",token);
         res.send("user created successfully");

        }
            
          });
        })
       }catch (err) {
        res.send(err.message)
    
    }

}