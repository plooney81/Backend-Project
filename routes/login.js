const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    res.render('login', {
        locals: {
            error: null,
            title: "Login"
        },
        partials:{
            head:"partials/head",
            footer:"partials/footer"
        }
    })
})

router.post('/', (req, res)=>{
    const {email, password} = req.body;
    if(!email || !password){
      res.render('login', {
        locals: {
          error: 'Please submit all required fields'
        }
      })
      return;
    }
  
    db.User.findOne({
      where: {
        email: email
      }
    })
      .then(user => {
        if(!user){
          res.render('login', {
            locals: {
              error: 'No user with that email'
            }
          })
          return;
        }
  
        bcrypt.compare(password, user.password, (err, matched) =>{
          if (matched){
            // res.send('YOU LOGGED IN')
            req.session.user = user;
            res.redirect('/');
          } else {
            res.render('login', {
              locals: {
                error: 'Incorrect password. Please try again.'
              }
            })
          }
          return;
        })
      })
  })

  module.exports = router;