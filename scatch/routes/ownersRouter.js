const express = require('express');
const router = express.Router();

router.get("/create",(req,res)=>{
    res.send("Owners route is working fine");
})

module.exports = router;