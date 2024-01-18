const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
	{
		company: {
			type: String,
			required: [true, "Please provide company name"],
			maxlength: 50,
			trim: true,
		},
		position: {
			type: String,
			required: [true, "Please provide position"],
			maxlength: 100,
			trim: true,
		},
		status: {
			type: String,
			enum: ["interview", "declined", "pending"],
			default: "pending",
		},
		createdBy: {
			type: mongoose.Types.ObjectId, //* Here we are providing the id of a user, and that has an ObjectId type.
			ref: "User", //* We are referencing the User Schema here.
			required: [true, "Please provide user"],
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
