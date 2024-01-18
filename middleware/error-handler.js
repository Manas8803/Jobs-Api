const { StatusCodes } = require("http-status-codes");
const { custom } = require("joi");
const errorHandlerMiddleware = (err, req, res, next) => {
	let customError = {
		statusCode: err.statusCode,
		msg: err.message || "Something went wrong. Please try again later.",
	};

	if (err.code && err.code === 11000) {
		customError.msg = `Duplicate value entered for ${Object.keys(
			err.keyValue
		)} field, please choose another value.`;
		customError.statusCode = 400;
	} //& To handle duplication errors.(Same Email Address)

	if (err.name === "ValidationError") {
		customError.msg = Object.values(err.errors)
			.map((item) => item.message)
			.join(" ");
		customError.statusCode = 400; //& To handle validation errors.(like no email or password)
	}

	//^ The Object.values() and Object.keys() methods return the all values and keys respectively for a given object as a parameter.(Both of these methods will return an array)

	if (err.name === "CastError") {
		customError.msg = `Resource not found with id : ${err.value}`;
		customError.statusCode = 404;
	}

	return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
