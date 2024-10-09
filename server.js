const dotenv = require("dotenv").config();
const path = require('path');
const express = require('express');
const morgan= require('morgan');
const session = require("express-session");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const signUpController= require("./controllers/auth/sign-up")
const signInController= require("./controllers/auth/sign-in")
const shelterController= require("./controllers/shelter.js")
const dogController= require("./controllers/dog.js")
const signOutController= require("./controllers/auth/sign-out")
const dashboardController = require("./controllers/dashboard.js")
const isSignedIn = require("./middlewares/is-signed-in.js")
const passUserToView = require("./middlewares/pass-user-to-view.js")

const app= express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride("_method"));

app.use(morgan('dev'));
app.use(
    session({
      secret: process.env.SESSION_SECRET, // used to sign the session id cookie to make it secure
      resave: false, // dont save session if it hasnt been modified
      saveUninitialized: true, // save a new session even if there is no data yet
    })
  );
    
app.use(passUserToView)
app.use(express.urlencoded({ extended: false }));

// letting express know about static css 
app.use(express.static(path.join(__dirname, 'public')));




const port = process.env.PORT ? process.env.PORT : "3000";

mongoose.connect(process.env.MONGODB_URI);

// Defining routes
app.get('/', (req, res) => {
  res.render('home.ejs');
});

 

app.use("/sign-in", signInController)
app.use("/sign-up", signUpController)
// Everything before isSgnedIn is not authenticated, so the browser can access
// TODO: Re enable this when done 
app.use(isSignedIn)  
// Everything below or under isSignedIn is a protected route or page 
app.use("/shelters", shelterController)
app.use("/dogs", dogController)
app.use("/sign-out", signOutController)
app.use('/dashboard', dashboardController);

mongoose.connection.on("connected", () => {
    console.clear();
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
    app.listen(port, () => {
      console.log(`The express app is ready on port ${port}!`);
    });
  });