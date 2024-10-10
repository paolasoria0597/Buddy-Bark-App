const express = require('express');
const Shelter = require('../models/shelter');
const User = require('../models/user');
const Dog= require('../models/dog')
const { use } = require('bcrypt/promises');
const router = express.Router();

router.get('/dashboard', (req, res) => {
    res.render('index.ejs')
})

router.get("/add", (req, res) => {
    console.log("Rendering add.ejs");
    const userIdFromSession = req.session.user
    console.log(userIdFromSession)
    res.render("shelters/add.ejs", {message: null, shelter: null})
});

router.get("/edit/:id", async (req, res) => {
    console.log("Rendering edit.ejs");
    //display the info that was created before
    const shelterId = req.params.id
    const existingShelter = await Shelter.findById(shelterId)
    console.log(existingShelter)
    res.render("shelters/edit.ejs", {
        message: null,
        shelter: existingShelter
    })
})


router.post("/add/", async (req, res) => {
    try {
        const shelterName = req.body.name;
        const shelterAddress = req.body.address;
        const shelterPhone = req.body.phone;
        const shelterEmail = req.body.email;
        const userIdFromSession = req.session.user._id

        console.log(userIdFromSession)


        const shelterExists = await Shelter.findOne({
            email: shelterEmail
        });


        if (!shelterExists) {
            await Shelter.create({
                name: shelterName,
                address: shelterAddress,
                phone: shelterPhone,
                email: shelterEmail,
                owner: userIdFromSession,
            })
            
            res.redirect('/dashboard')
        } else {
             res.render('shelters/add.ejs', {message: "You can't add this shelter to your profile. It belongs to someone else.", shelter: null})
        }
    } catch (error) {
        console.error("Error creating shelter", error);
        res.render('shelters/add.ejs', {message: "An error occurred. Please try again.", shelter: null});
    }
});

// Update 

router.put("/edit/:id", async (req, res) => {
    try {
        const shelterId = req.params.id;
        const shelterName = req.body.name;
        const shelterAddress = req.body.address;
        const shelterPhone = req.body.phone;
        const shelterEmail = req.body.email;

        //update shelter by ID
        const recentlyUpdatedShelter = await Shelter.findByIdAndUpdate(shelterId, {
            name: shelterName,
            address: shelterAddress,
            phone: shelterPhone,
            email: shelterEmail
        }, {new: true});

        return res.redirect('/dashboard')
    } catch (error) {
        console.error("Error updating shelter", error);
        return res.render('shelters/add.ejs', {message: "An error occurred. Please try again."});
    }
});


router.delete("/delete/:shelterId", async (req, res) => {
    try{
        const shelterId = req.params.shelterId
    // To delete a shelter, we find the shelter, then the dogs,
    // delete all dogs that belong to shelter first, 
    //fnally we delte the shelter
    const shelter= await Shelter.findById(shelterId)
    if(shelter) { 
        const dogIds= shelter.dogs;
        await Dog.deleteMany({_id: { $in: dogIds}});
        await Shelter.findByIdAndDelete(shelterId); 
        return res.redirect('/dashboard')
    }
 } catch(error) {
    console.error("Error deleting shelter", error);
    return res.render('shelters/add.ejs', {message: "An error occurred. Please try again."});
 }
});




module.exports = router;