const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { UnauthenticatedError } = require("../errors");

const authenticationMiddleware = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer "))
		throw new UnauthenticatedError("Invalid Token");

	const token = authHeader.split(" ")[1];
	try {
		const decoded = jwt.verify(token, process.env.JWT_TOKEN);
		const { name, userId } = decoded;
		req.user = { name, userId };
		next();
	} catch (err) {
		throw new UnauthenticatedError("Not authorized to access this route");
	}
};

module.exports = authenticationMiddleware;
