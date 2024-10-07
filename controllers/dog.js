const express= require ('express');
const Dog= require('../models/dog.js');
const router=  express.Router ();

router.get("/", (req,res) => {
     console.log("Rendering dog.ejs");
     res.render("dogs/dog.ejs", {message:null})
});

router.post("/", async(req,res)=>{
    try{
        const dogName= req.body.name;
        const dogAge= req.body.age;
        const dogBreed= req.body.breed;
        const dogShelter= req.body.shelter;

        await Dog.create({
            name: dogName,
            age: dogAge,
            breed: dogBreed,
            dogShelter: req.body.shelter,
        })
            return res.render("dogs/dog", {message:"Dog has been added successfully"})
        } catch(error) {
            console.error("Error creating dog", error);
            return res.render("dogs/dog", {message:" An error occurred. Please try again!"})
         }
        });

        module.exports = router;
            
    // creates a mini express app (a router) for handling routes re