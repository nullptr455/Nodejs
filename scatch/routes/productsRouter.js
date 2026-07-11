const express = require('express');
const router = express.Router();

router.get("/",(req,res)=>{
    res.send("product route is working fine");
})

module.exports = router;