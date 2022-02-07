const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");

const User = require("../models/User");
const File = require("../models/File");
const auth = require("../middleware/auth");

//Configuration for Multer
const multerStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "/tmp/uploads");
	},
	filename: (req, file, cb) => {
		const ext = file.mimetype.split("/")[1];
		cb(null, `${file.originalname.split(".")[0]}-${Date.now()}.${ext}`);
	},
});

// Multer Filter
// const multerFilter = (req, file, cb) => {
// 	if (file.mimetype.split("/")[1] === "pdf") {
// 		cb(null, true);
// 	} else {
// 		cb(new Error("Not a PDF File!!"), false);
// 	}
// };

//Calling the "multer" Function
const upload = multer({
	storage: multerStorage,
});

router.post("/upload", auth, upload.single("file"), async (req, res) => {
	console.log(req.file);
	try {
		if (req.user) {
			console.log(req.user);
			const newFile = await File.create({
				name: req.file.filename,
				user: req.user.id,
			});
			res.status(200).json({
				status: "success",
				message: "File created successfully!!",
			});
		} else {
			res.status(400).json({
				message: "Not Authenticated",
			});
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			error,
		});
	}
});

router.get("/user/all", auth, async (req, res) => {
	console.log("called");
	try {
		const files = await File.find({ user: req.user.id });
		res.status(200).json({
			status: "success",
			files,
		});
	} catch (error) {
		res.status(500).json({
			status: "Fail",
			error,
		});
	}
});

module.exports = router;
