const express = require('express');
const router = express.Router();
const ownerModel = require('../models/owner-model');

if(process.env.NODE_ENV === "development"){
    router.post("/create",async (req,res)=>{
       const owners  = await ownerModel.find();
       if(owners.length > 0){
        return res
        .status(501)
        .send("you can not have premission to create new owner");
       }

       res.status(200).send("you can create new owner");

       let {fullname,email,password,gstin} = req.body;
     const createdOwner = await ownerModel.create({
        fullname,
        email,
        password,
        
       });
       res.status(203).send(createdOwner);
    })
};


router.get("/",(req,res)=>{
    res.send("Owners route is working fine");
})



module.exports = router;