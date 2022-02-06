const express = require("express");
const bodyParser = require("body-parser");
var app = express();

const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());

app.get("/", (req, res) => {
	res.json({ message: "Hello World!" });
});

app.listen(PORT, (req, res) => {
	console.log(`Server started at PORT: ${PORT}`);
});
