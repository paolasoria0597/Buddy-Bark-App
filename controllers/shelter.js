const express= require('express');
const Shelter = require('../models/shelter');
const router= express.Router();

router.get("/", (req,res)=> {
    console.log("Rendering add.ejs");
    res.render("shelters/add", {message:null})
});

router.post("/", async(req,res)=> {
    try{
    const shelterName= req.body.name;
    const shelterAddress= req.body.address;
    const shelterPhone= req.body.phone;
    const shelterEmail= req.body.email;

    const shelterExists= await Shelter.findOne({
        email:shelterEmail
    });
    if (shelterExists==null){
      await Shelter.create({
        name: shelterName,
        address: shelterAddress,
        phone: shelterPhone,
        email:shelterEmail,
      })
      res.redirect('/')
    } else{
        return response.render('shelters', {message:"Shelter already added"})
    }
} catch(error) {
    console.error("Error creating shelter", error);
    return res.render('shelters', {message: "An error occurred. Please try again."});
}
});




module.exports = router;