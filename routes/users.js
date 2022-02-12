
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require("jsonwebtoken");
const userSchema = require("../models/users");
const { check, validationResult } = require('express-validator');

//login

router.post('/login', (req, res, next) => {
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

module.exports = router;
