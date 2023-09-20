const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const {
	BadRequestError,
	NotFoundError,
	UnauthenticatedError,
} = require("../errors");

const register = async (req, res) => {
	const tempUser = await User.create({ ...req.body });
	const token = tempUser.createJWT();

	res
		.status(StatusCodes.CREATED)
		.json({ user: { name: tempUser.name }, token: token });
};

const login = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password)
		throw new BadRequestError("Please provide with all the credentials");

	const user = await User.findOne({ email: email });
	if (!user) throw new NotFoundError("Email is not registered");

	const checkPass = await user.checkPassword(password);
	if (!checkPass) throw new UnauthenticatedError("Password does not match");

	const token = user.createJWT();
	const { name } = user;

	res.status(StatusCodes.OK).json({ name, token });
};

module.exports = { register, login };
