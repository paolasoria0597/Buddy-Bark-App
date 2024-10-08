const express= require('express');
const Shelter = require('../models/shelter');
const router= express.Router();

router.get('/dashboard', (req,res)=> {
    res.render('shelters/index.ejs')
})

router.get("/add", (req,res)=> {
    console.log("Rendering add.ejs");
    res.render("shelters/add", {message:null, shelter: null})
});
router.get("/edit", async (req,res)=>{
     console.log("Rendering edit.ejs");
     //display the info that was created before
     const existingShelter = await Shelter.findById('670374c7668770708aec3de7')
     console.log(existingShelter)
     res.render("shelters/edit",{
        message: "any message",
        shelter: existingShelter
     })
})


router.post("/add", async(req,res)=> {
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

// Update 

router.put("/edit/:id", async (req,res)=> {
    try{
    const shelterId= req.params.id;
    const shelterName= req.body.name;
    const shelterAddress= req.body.address;
    const shelterPhone= req.body.phone;
    const shelterEmail= req.body.email;

    //update shelter by ID
    const recentlyUpdatedShelter = await Shelter.findByIdAndUpdate(shelterId,{name:shelterName, address:shelterAddress, phone:shelterPhone, email:shelterEmail},{new:true});

    return res.redirect('/')
    } catch(error) {
        console.error("Error updating shelter", error);
        return res.render('shelters', {message: "An error occurred. Please try again."});
    }
});

// Delete 




module.exports = router;