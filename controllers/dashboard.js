const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose'); 
const Dog = require('../models/dog');
const Shelter= require('../models/shelter')



router.get('/', async (req, res) => {
    // We need to now fetch the fdata to show on Dashboard
    // We have a logged User and we can find the userId in the session
    const userId = req.session.user._id

    //Now that we have the ID, we are going to fetch the User with the shelters (populated data) not just the IDs
    const userWithPopulatedShelters = await User.findById(userId)  // Finds the User
        .populate({
            path: 'shelters', // tells mongo to populate shelters within User
            populate: [{path: 'dogs'}] // populating the dogs array within shelters
        }) 
        .exec()

    // Now I have the User with the Shelters
    const shelters = userWithPopulatedShelters.shelters // extracting just the shelters from the User

    // getting optional shelterId query param if passed from Dahboard when choosing another shelter
    const shelterId = req.query.shelterId

    // Create two variable to store currentShelter and RemainingShelters. We are going to use let, because we are going to reassign
    let currentShelter = {};
    let remainingShelters = [];

    if(shelterId) { // if the shleterId is passed from a view
        currentShelter = shelters.find(shelter => shelter._id.toString() === shelterId)  // converting shelter._id to string because it's an ObjectId object from mongo
        // Once we find it, we remove it from the shelters array and assign the remaining to remainingShelters
        remainingShelters = shelters.filter(shelter => shelter._id.toString() !== shelterId)
    } else {
        currentShelter = shelters[0] // if view doesnt pass shelterId in query params we default to first
        remainingShelters = shelters.slice(1)
    }

    console.log("current shelter", JSON.stringify(currentShelter, null, 2))
    console.log("remaining shelters", JSON.stringify(remainingShelters, null, 2))


    // Now we will send the current shelter and my remainingShelters to the view
    res.render('index.ejs', {
        currentShelter: currentShelter,
        remainingShelters: remainingShelters
    })
})

module.exports = router