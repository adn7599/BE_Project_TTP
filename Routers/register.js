const express = require("express");
const GP_Customer = require('../Models/GP_Customer');

const router = express.Router();

router.post("/", async (req, res,next) => {
  try{
    const custs = await GP_Customer.findAll();
    console.log(custs);
    res.json(custs);
  }
  catch(error){
   next(error); 
  }
});


module.exports = router;
