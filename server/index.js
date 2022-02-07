const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const fileRouter = require("./routes/file");
const MongoServerInit = require("./db/db");

// Initialize Mongo DB Server Connection
MongoServerInit();

var app = express();
app.use(cors());

const PORT = process.env.PORT || 4000;

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/file", fileRouter);

app.listen(PORT, (req, res) => {
	console.log(`Server started at PORT: ${PORT}`);
});
