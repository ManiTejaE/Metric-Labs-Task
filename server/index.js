const express = require("express");
const bodyParser = require("body-parser");
const authRouter = require("./routes/auth");
const MongoServerInit = require("./db/db");

// Initialize Mongo DB Server Connection
MongoServerInit();

var app = express();

const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());

app.use("/api/auth", authRouter);

app.listen(PORT, (req, res) => {
	console.log(`Server started at PORT: ${PORT}`);
});
