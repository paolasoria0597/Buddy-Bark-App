const express = require('express');
const router = express.Router();
const User= require('../../models/user');
const bcrypt = require('bcrypt');


// This allows the browser to open the sign-up page
router.get("/",(req,res) => {
    res.render("auth/sign-up.ejs", {message: null})
})


// base route is defined in server.js
router.post("/", async (request, response) => {

try{
    console.log(request.body)
    // Setting variables that hold the variables coming from the view
    const email= request.body.email
    const name= request.body.name
    const password= request.body.password;

    // Check if passwords match


    // check if user already exists in Mongo db by querying the Database
    const userExists = await User.findOne({
        email: email
    })

    if(userExists===null){
        // If user doesn't exist, save into database
        // but beforre saving, encrypt password 
        // Must hash the password before sending to the database

        const hashedPassword = bcrypt.hashSync(password, 10);
        await User.create({
            name: name,
            email: email,
            password: hashedPassword,
        })
        response.redirect('/')
    } else {
        // if user exists 
        return response.render('auth/sign-up.ejs', {message: "User Already Exists"})
    }

} catch(error) {
    console.log(error)
    response.send("Ooops, Something went wrong").status(500)
}

})
module.exports = router