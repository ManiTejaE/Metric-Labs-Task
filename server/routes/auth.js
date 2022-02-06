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

			jwt.sign(payload, "ABCD9876#@", { expiresIn: "2 days" }, (e, token) => {
				if (e) throw e;
				res.status(200).json({ token });
			});
		} catch (e) {
			console.log(e.message);
			res.status(500).send("Error signing up!");
		}
	}
);

module.exports = router;
