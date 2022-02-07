const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");

const MONGOURI = "mongodb://localhost:27017/metriclabstask";

const MongoServerInit = async () => {
	try {
		await mongoose
			.connect(MONGOURI, {
				useNewUrlParser: true,
			})
			.then(async () => {
				try {
					const { email, password, isAdmin, first_name } = {
						email: "admin@task.com",
						password: "admin",
						isAdmin: true,
						first_name: "Admin",
					};

					let user;
					user = await User.findOne(
						{ email },
						function (e, userObj) {
							return userObj;
						}
					).clone();
					if (user) return;

					user = new User({ first_name, email, password, isAdmin });
					const salt = await bcrypt.genSalt(10);
					user.password = await bcrypt.hash(password, salt);

					await user.save();
					console.log("Admin User Created");
				} catch (e) {
					console.log(e);
				}
			});
		console.log("Connected to DB!");
	} catch (e) {
		console.log(e);
		throw e;
	}
};

module.exports = MongoServerInit;
