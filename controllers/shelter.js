const express = require('express');
const Shelter = require('../models/shelter');
const User = require('../models/user');
const { use } = require('bcrypt/promises');
const router = express.Router();

router.get('/dashboard', (req, res) => {
    res.render('index.ejs')
})

router.get("/add", (req, res) => {
    console.log("Rendering add.ejs");
    const userIdFromSession = req.session.user
    console.log(userIdFromSession)
    res.render("shelters/add", {message: null, shelter: null})
});

router.get("/edit/:id", async (req, res) => {
    console.log("Rendering edit.ejs");
    //display the info that was created before
    const shelterId = req.params.id
    const existingShelter = await Shelter.findById(shelterId)
    console.log(existingShelter)
    res.render("shelters/edit", {
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


        if (shelterExists == null) {
            const newAddedShelter = await Shelter.create({
                name: shelterName,
                address: shelterAddress,
                phone: shelterPhone,
                email: shelterEmail,
                owner: userIdFromSession,
            })
            
            res.redirect('/')
        } else {
            return response.render('shelters', {message: "Shelter already added"})
        }
    } catch (error) {
        console.error("Error creating shelter", error);
        return res.render('shelters', {message: "An error occurred. Please try again."});
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
        return res.render('shelters', {message: "An error occurred. Please try again."});
    }
});

// Delete 


module.exports = router;