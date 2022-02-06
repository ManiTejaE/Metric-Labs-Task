const express = require("express");
const router = express.Router();

const User = require("../models/User");
const auth = require("../middleware/auth");

router.get("/me", auth, async (req, res) => {
	try {
		let userObj = await User.findById(req.user.id);
		const { password, ...user } = userObj._doc;
		res.json(user);
	} catch (e) {
		res.send({ message: "Error in Fetching user" });
	}
});

module.exports = router;
