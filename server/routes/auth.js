const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require("../models/User");

router.post(
	"/signup",
	[
		check("email", "Please enter a valid email").isEmail(),
		check("password", "Please enter a valid password").isLength({
			min: 4,
		}),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array(),
			});
		}

		const { first_name, last_name, email, password } = req.body;
		try {
			let user = await User.findOne({ email });
			if (user) {
				return res.status(400).json({
					message: "User already exists.",
				});
			}

			user = new User({ first_name, last_name, email, password });

			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);

			await user.save();

			const payload = {
				user: {
					id: user.id,
				},
			};

			jwt.sign(payload, process.env.SECRET_JWT_KEY, { expiresIn: 30000 }, (e, token) => {
				if (e) throw e;
				res.status(200).json({ token });
			});
		} catch (e) {
			res.status(500).send("Error signing up!");
		}
	}
);

router.post(
	"/login",
	[
		check("email", "Please enter a valid email").isEmail(),
		check("password", "Please enter a valid password").isLength({
			min: 4,
		}),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array(),
			});
		}

		const { email, password } = req.body;
		try {
			let user = await User.findOne({ email });
			if (!user)
				return res.status(400).json({
					message: "User Not Exist",
				});

			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch)
				return res.status(400).json({
					message: "Incorrect Password !",
				});

			const payload = {
				user: {
					id: user.id,
				},
			};

			jwt.sign(
				payload,
				process.env.SECRET_JWT_KEY,
				{
					expiresIn: 30000,
				},
				(err, token) => {
					if (err) throw err;
					res.status(200).json({
						token,
					});
				}
			);
		} catch (e) {
			console.error(e);
			res.status(500).json({
				message: "Error Logging In!",
			});
		}
	}
);

module.exports = router;
