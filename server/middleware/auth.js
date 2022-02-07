const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
	let token;
	if (req.header("Authorization")) token = req.header("Authorization").split(" ")[1];
	if (!token) return res.status(401).json({ message: "Auth Error" });

	try {
		const decoded = jwt.verify(token, process.env.SECRET_JWT_KEY);
		req.user = decoded.user;
		next();
	} catch (e) {
		console.error(e);
		res.status(500).send({ message: "Invalid Token" });
	}
};
