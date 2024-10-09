const express = require("express");
const Dog = require("../models/dog.js");
const Shelter = require("../models/shelter.js");
const router = express.Router();

router.get("/shelter/:shelterId", async (req, res) => {
  const shelterId = req.params.shelterId;
  res.render("dogs/dog.ejs", { message: null, shelterId: shelterId });
});

router.post("/shelter/:shelterId", async (req, res) => {
  try {
    // req.body.shelter = req.params.shelterId; //<<====NEVER DO THIS
    const name = req.body.name
    const age = req.body.age
    const breed = req.body.breed
    const image = req.body.image
    const shelterId = req.params.shelterId
    await Dog.create({
        name: name,
        age: age, 
        breed: breed, 
        image: image,
        shelter: shelterId
    });
    res.redirect(`/dashboard?shelterId=${shelterId}`)
  } catch (error) {
    console.error("Error creating dog", error);
    return res.render("dogs/dog", {
      message: " An error occurred. Please try again!",
      shelterId: null
    });
  }
});

router.get("/:dogId/edit", async (req, res) => {
  console.log("Rendering edit.ejs");
  const existingDog = await Dog.findById(req.params.dogId); // req.params.dogId
  console.log(existingDog);
  res.render("dogs/edit", {
    message: "any message",
    dog: existingDog,
  });
});

router.put("/:dogId/edit", async (req, res) => {
  try {
    const dogId = req.params.dogId;

    await Dog.findByIdAndUpdate(dogId, req.body); // { new: true } option as third argument ensures the returned document is the updated
    return res.render("/shelters/dashboard");
  } catch (error) {
    console.error("Error updating shelter", error);
    return res.render("/shelters/dashboard", {
      message: "An error occurred. Please try again.",
    });
  }
});

module.exports = router;

// creates a mini express app (a router) for handling routes re
