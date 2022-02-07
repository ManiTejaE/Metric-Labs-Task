const express = require("express");
const router = express.Router();
const fs = require("fs");
const mime = require("mime");
const multer = require("multer");
const path = require("path");

const User = require("../models/User");
const File = require("../models/File");
const auth = require("../middleware/auth");
const appDir = path.dirname(require.main.filename);

//Configuration for Multer
const multerStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, `${appDir}/tmp/uploads`);
	},
	filename: (req, file, cb) => {
		const ext = file.mimetype.split("/")[1];
		cb(null, `${file.originalname.split(".")[0]}-${Date.now()}.${ext}`);
	},
});

// Multer Filter
const multerFilter = (req, file, cb) => {
	if (file.mimetype.split("/")[1] === "pdf") {
		cb(null, true);
	} else {
		cb(new Error("Not a PDF File!!"), false);
	}
};

//Calling the "multer" Function
const upload = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
}).single("file");

router.post("/upload", auth, async (req, res) => {
	upload(req, res, async function (err) {
		if (err) {
			res.status(415).json({ message: "Uploaded file is not a pdf." });
		} else {
			try {
				if (req.user) {
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
		}
	});
});

router.get("/download/:id", auth, async (req, res) => {
	if (!req.user) {
		return res.status(401).send("User not logged in.");
	}
	try {
		const { id } = req.params;
		const file = await File.findById({ _id: id });
		const filepath = appDir + `/tmp/uploads/${file.name}`;
		var filename = path.basename(filepath);
		const mimetype = mime.lookup(filepath);

		res.setHeader("Content-Disposition", "attachment; filename=" + filename);
		res.setHeader("Content-Type", mimetype);

		const filestream = fs.createReadStream(filepath);

		filestream.pipe(res);
		// res.download(filepath);
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: "Error downloading file." });
	}
});

router.get("/user/all", auth, async (req, res) => {
	if (!req.user) {
		return res.status(401).send("User not logged in.");
	}
	try {
		const files = await File.find({ user: req.user.id });
		res.status(200).json({
			status: "success",
			files,
		});
	} catch (e) {
		res.status(500).json({
			status: "Fail",
			e,
		});
	}
});

router.get("/admin/all", auth, async (req, res) => {
	if (!req.user) {
		return res.status(401).send("User not logged in.");
	}
	try {
		const user = await User.findById(req.user.id);
		let files;
		if (user) {
			if (user.isAdmin) {
				files = await File.find()
					.populate("user")
					.exec((e, files) => {
						if (e)
							res.status(500).json({
								status: "Fail",
								e,
							});
						files.forEach((file) => {
							const tempUser = file.user;
							file.user = {};
							file.user.email = tempUser.email;
						});
						res.status(200).json({
							status: "success",
							files,
						});
					});
			} else {
				return res.status(401).send("User doesnot have enough privileges");
			}
		}
	} catch (e) {
		res.status(500).json({
			status: "Fail",
			e,
		});
	}
});

module.exports = router;
