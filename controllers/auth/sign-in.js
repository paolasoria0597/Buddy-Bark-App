const express= require('express');
const router = express.Router();
const User= require('../../models/user');
const bcrypt = require('bcrypt');

router.get("/",(req,res) => {
    res.render("auth/sign-in.ejs", {message: null})
})

router.post("/", async (req,res)=> {
    try {
    const email= req.body.email;
    const password= req.body.password;
const userExists= await User.findOne({
    email:email
});
// this checks to see if the user exists and has an email stored in †he database if not
  if (!userExists){ // if user does not exist send a sign-in failed message and ask user to try again
    return res.render('auth/sign-in.ejs', {message: "Sign in failed. Try again"})
  }
  // There is a user! Time to test their password with bcrypt
  const validPassword = bcrypt.compareSync(
    req.body.password,
    userExists.password
  );
  if (!validPassword) {
    return res.send('sign-in failed. Please try again')
  };
  // There is a user AND they had the correct password. Time to make a session!
    // Avoid storing the password, even in hashed format, in the session
    // If there is other data you want to save to `req.session.user`, do so here!
    req.session.user = { // storing data from user in a session. the data stored is email, and _id
        email: userExists.email,
        _id: userExists._id,
        name: userExists.name,
      };
    
      res.redirect('/');
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
});

module.exports = router;