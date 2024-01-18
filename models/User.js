const mongoose = require("mongoose");
const { ConflictError, UnauthenticatedError } = require("../errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please enter a name."],
		minlength: 3,
		maxlength: 30,
	},
	email: {
		type: String,
		required: [true, "Please enter an email."],
		match: [
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			"Please provide a valid email",
		], //& Regular expression matching for email addresses.

		unique: true, //& In Mongoose, the unique property is used to specify that a certain field in a schema should have a unique value. This means that each document in the collection must have a different value for that field. By setting unique: true, you're telling Mongoose to create an index on the email field that enforces uniqueness.
	},

	password: {
		type: String,
		required: [true, "Please enter a password."],
		minlength: 6,
	},
});

UserSchema.pre("save", async function () {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
}); //& UserSchema.pre("save", async function () { ... }): This line sets up a pre-save middleware for the "save" event on the UserSchema. This means that before a document of this schema is saved to the database, the function defined inside the callback will be executed.

UserSchema.methods.createJWT = function () {
	const token = jwt.sign(
		{ userId: this._id, name: this.name },
		process.env.JWT_TOKEN,
		{ expiresIn: process.env.JWT_LIFETIME }
	);
	return token;
}; //& This line is adding a method called createJWT to the methods property of UserSchema. This means that any instance of a document created from this schema will have access to this method.

UserSchema.methods.checkPassword = async function (enteredPass) {
	const comp = await bcrypt.compare(enteredPass, this.password);
	return comp;
};

module.exports = mongoose.model("User", UserSchema);
