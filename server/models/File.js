const mongoose = require("mongoose");
const User = require("./User");

const FileSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, "Uploaded file must have a name"],
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: User,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

module.exports = mongoose.model("file", FileSchema);
