var userModel    = require('../models/users');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const userSchema = require("../models/users");
const crypto = require("crypto");
const sendEmail = require("../models/sendEmail");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
var ObjectId = require('mongodb').ObjectId;


router.post("/passwordreset", async (req, res) => {
	try {
		const emailSchema = Joi.object({
			email: Joi.string().email().required().label("Email"),
		});
		const { error } = emailSchema.validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		let user = await userSchema.findOne({ email: req.body.email });
		if (!user)
			return res
				.status(409)
				.send({ message: "User with given email does not exist!" });


		const url = `${process.env.BASE_URL}password-reset/${user._id}`;
		await sendEmail(user.email, "Password Reset", url);

		res
			.status(200)
			.send({ message: "Password reset link sent to your email account" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
    console.log(error)
	}
});


router.get("/password-reset/:id", async (req, res) => {
    try {
		const user = await userSchema.findOne({ '_id': ObjectId(req.params.id) });
		if (!user)
      return res.status(400).send({ message: "Invalid link" });
		res.status(200).send("Valid Url");
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
    console.log(error)
	}
});

router.post("/password-reset/:id", async (req, res) => {
	try {
		const passwordSchema = Joi.object({
			password: passwordComplexity().required().label("Password"),
		});
		const { error } = passwordSchema.validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await userSchema.findOne({  '_id': ObjectId(req.params.id) });

  	if (!user)
      return res.status(400).send({ message: "Invalid link" });
		if (!user.verified)
      user.verified = true;

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);
    const result = await userSchema.findByIdAndUpdate({'_id': ObjectId(req.params.id)}, {password: hashPassword}, {new: true});

		res.status(200).send({ message: "Password reset successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
    console.log(error)
	}
});


module.exports = router;
