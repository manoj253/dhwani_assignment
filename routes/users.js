const express = require('express');
var router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/user');
const Form = require('../models/form');
const {FB, FacebookApiException} = require('fb');

var Twit = require('twit');
var twitter = require('../config/twitter');
var config = require('../config/database')
var emailConfig = require('../config/email')
var T = new Twit(twitter);




router.post('/register', (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });

  User.addUser(newUser, (err, user) => {
    if(err){
      res.json({success: false, msg:'Failed to register user'});
    } else {
      res.json({success: true, msg:'User registered'});
    }
  });
});



// Authenticate
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign({data: user}, config.secret, {
          expiresIn: 604800 // 1 week
        });

        res.json({
          success: true,
          token: `Bearer ${token}`,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        });
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});


router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});

router.post('/form',(req,res,next)=>{
  const name = req.body.name;
  const phone = req.body.phone;
  const remark = req.body.remark;
  let newForm = new Form({name:name,phone:phone,remark:remark}).save()
  .then((docs)=>{
      console.log('form created')
      let mailOptions = {
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: 'cse.manoj253@gmail.com', // list of receivers
        subject: 'Thank for form submission ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: `Form Details Name ${name} phone number ${phone} remark ${remark}` // html body
    };

    // send mail with defined transport object
    emailConfig.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    });


    // Twitter post

    var tweet = { 
      status: `name ${name} phone ${phone} remark ${remark}` 
    }

    T.post('statuses/update', tweet, tweeted)

   function tweeted(err, data, response) {
    if(err){
      console.log(err);
    console.log("Something went wrong!");
    }
    else{
      console.log("Voila It worked!");
      }
    }


    // fb post 
    // FB.setAccessToken('');

    // var body = 'My first post using facebook-node-sdk';
    // FB.api('me/feed', 'post', { message: body }, function (res) {
    //   if(!res || res.error) {
    //     console.log(!res ? 'error occurred' : res.error);
    //     return;
    //   }
    //   console.log('Post Id: ' + res.id);
    // });



    res.send({success:true,msg:"form created",data:{name:name,phone:phone,remark:remark}})
  }).catch((err)=>{
    console.log('Something went wrong');
    res.send({success:false,msg:"Something went wrong"})
    console.log(err);
  })
})





// router.get('/twitter',(req,res,next)=>{
// 	T.post('statuses/update', tweet, tweeted)

// 	 function tweeted(err, data, response) {
// 	  if(err){
// 	  	console.log(err);
// 	console.log("Something went wrong!");
// 	}
// 	else{
// 		console.log("Voila It worked!");
// 		}
// 	}

// 	next();
// });




module.exports = router;