// Using express ... create a router object
const router = require('express').Router();
// import the user model through db.js
// Pascal case is convention for model class
// NOT SURE ABOUT WHAT THIS IS DOING ... why require db.js? 
const User = require('../db.js').import('../models/user.js');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

/****************************
*** USER SIGNUP ***
****************************/
//create a new endpoint that will recieve new user data and add to the database
router.post('/create', function(req, res){
  //console.log(req.body);
  let userModel = {
    email: req.body.user.email,
    password: bcrypt.hashSync(req.body.user.password, 13)
  }

  User.create(userModel)
    .then(function createSuccess(user){
      let token = jwt.sign(
        { 
          id: user.id,
          email: user.email
        }, 
        process.env.JWT_SECRET, 
        {
          expiresIn: 60*60*24
        });
      res.json(
        { user: user,
          message: "User successfully created",
          sessionToken: token
        }   //returning an object with the user data from the database (returned by the 'create' method)
      );
    })
    .catch(function(err){
      res.status(500).json(
        {error: err}
      );
    });

});

/****************************
*** USER LOGIN ***
****************************/
//create a new endpoint that will recieve user login data
let validateSession = require('../middleware/validate-session');
router.post('/login', function(req, res){
  // query the database with the user email
  User.findOne({
      where:{
        email: req.body.user.email
      }
    })
    .then(function loginSuccess(user){ 
      if(user){
        bcrypt.compare(req.body.user.password, user.password, function(err, matches){
          if(matches){
            let token = jwt.sign(
              { 
                id: user.id,
                email: user.email
              }, 
              process.env.JWT_SECRET, 
              {
                expiresIn: 60*60*24
              });
            res.status(200).json(
              { user: user,
                message: "Login succeeded",
                sessionToken: token
              }
            );
          }
        });
        
      }else{
        res.status(500).send(`${req.body.user.email} not found`);
      }
    })
    .catch(function(err){
      res.status(500).json(
        {error: err}
      );
    });
});

module.exports = router;