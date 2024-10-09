const mongoose= require("mongoose");
const User = require('./user');
const { json } = require("express");

const shelterSchema= new mongoose.Schema({
   name: {
    type: String,
    required: true,
   },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
     dogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Dog",
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    image: {
        type: String, 
    },
});

// We want to create a post save Hook so that it always triggers when we create a new Shelter

shelterSchema.post('save', async (recentlyCreatedShelter) => {
    // this Function will run whenever a Shelter is created
    try {
        const user = await User.findById(recentlyCreatedShelter.owner)

        // We need to make sure that we don't duplicate the shelter, so we need to check if the shelter already exists
        const shelterExistis = user.shelters.some((shelter) => shelter._id.equals(recentlyCreatedShelter._id))

        if (user && !shelterExistis) { // if user exists and if shelter doesn't already exist, 
            user.shelters.push(recentlyCreatedShelter._id)
            await user.save()
        }
    } catch (error) {
        console.log('Error updating User with new Shelter. User does not have a reference to this shelter', error)
    }
})

const Shelter= mongoose.model('Shelter', shelterSchema);
module.exports = Shelter;