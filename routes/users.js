var userModel    = require('../models/users');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require("jsonwebtoken");
const userSchema = require("../models/users");
const { check, validationResult } = require('express-validator');
const authorize = require('./auth')
const crypto = require("crypto");
const sendEmail = require("../models/sendEmail");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
var ObjectId = require('mongodb').ObjectId;
var url = "mongodb+srv://bpurden:Monkeybutt1@benchmark.avxjr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const mongodb = require('mongodb');
var dbConn;


mongodb.MongoClient.connect(url, {
    useUnifiedTopology: true,
}).then((client) => {
    dbConn = client.db();
}).catch(err => {
    console.log("DB Connection Error: ${err.message}");
});

router.post('/login', (req, res, next) => {
  console.log(req.body.email)
  let getUser;
  userSchema
    .findOne({
      email: req.body.email,
    })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: 'Authentication failed',
        });
      }
      getUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((response) => {
      if (!response) {
        return res.status(400).json({
          message: 'Authentication failed',
        });
      }
      let jwtToken = jwt.sign(
        {
          email: getUser.email,
          userId: getUser._id,
        },
        'longer-secret-is-better',
        {
          expiresIn: '1h',
        }
      );
      res.status(200).json({
        token: jwtToken,
        expiresIn: 3600,
        msg: getUser,
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: 'Authentication failed',
      });
    });
});


router.route('/all-user').get(authorize, (req, res) => {
    userSchema.find((error, response) => {
        if (error) {
            return next(error)
        } else {
            res.status(200).json(response)
        }
    })
})


// Returns all the users probably gonna switch it up but at least it works
router.post('/all-users', (req,res)=>{
  userModel.find({},(error, response)=>{
    if(error){
      return next(error)
    }else{
      res.status(200).json(response)
    }
  })
})

//register

router.post('/register',  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422);
    } else {
      bcrypt.hash(req.body.password, 10).then((hash) => {
        const user = new userSchema({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          username: req.body.username,
          email: req.body.email,
          password: hash,
        });
        user
          .save()
          .then((response) => {
            res.status(201).json({
              message: 'User successfully created!',
              result: response,
            });
          })
          .catch((error) => {
            res.status(500).json({
              message: 'error',
            });
          });
      });
    }
  }
);


// router.post("/passwordreset", async (req, res) => {
// 	try {
// 		const emailSchema = Joi.object({
// 			email: Joi.string().email().required().label("Email"),
// 		});
// 		const { error } = emailSchema.validate(req.body);
// 		if (error)
// 			return res.status(400).send({ message: error.details[0].message });
//
// 		let user = await userSchema.findOne({ email: req.body.email });
// 		if (!user)
// 			return res
// 				.status(409)
// 				.send({ message: "User with given email does not exist!" });
//
//
// 		const url = `${process.env.BASE_URL}password-reset/${user._id}`;
// 		await sendEmail(user.email, "Password Reset", url);
//
// 		res
// 			.status(200)
// 			.send({ message: "Password reset link sent to your email account" });
// 	} catch (error) {
// 		res.status(500).send({ message: "Internal Server Error" });
//     console.log(error)
// 	}
// });
//
//
// router.get("/password-reset/:id", async (req, res) => {
//     try {
// 		const user = await userSchema.findOne({ '_id': ObjectId(req.params.id) });
// 		if (!user)
//       return res.status(400).send({ message: "Invalid link" });
// 		res.status(200).send("Valid Url");
// 	} catch (error) {
// 		res.status(500).send({ message: "Internal Server Error" });
//     console.log(error)
// 	}
// });
//
// router.post("/password-reset/:id", async (req, res) => {
// 	try {
// 		const passwordSchema = Joi.object({
// 			password: passwordComplexity().required().label("Password"),
// 		});
// 		const { error } = passwordSchema.validate(req.body);
// 		if (error)
// 			return res.status(400).send({ message: error.details[0].message });
//
// 		const user = await userSchema.findOne({  '_id': ObjectId(req.params.id) });
//
//   	if (!user)
//       return res.status(400).send({ message: "Invalid link" });
// 		if (!user.verified)
//       user.verified = true;
//
// 		const salt = await bcrypt.genSalt(Number(process.env.SALT));
// 		const hashPassword = await bcrypt.hash(req.body.password, salt);
//     const result = await userSchema.findByIdAndUpdate({'_id': ObjectId(req.params.id)}, {password: hashPassword}, {new: true});
//
// 		res.status(200).send({ message: "Password reset successfully" });
// 	} catch (error) {
// 		res.status(500).send({ message: "Internal Server Error" });
//     console.log(error)
// 	}
// });


module.exports = router;
