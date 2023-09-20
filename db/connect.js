const mongoose = require("mongoose");

const connectDB = (url) => {
	mongoose
		.connect(url, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => console.log("Connnected to the DB."))
		.catch((err) => console.log(`Error in connecting to the DB.\n${err}`));
};

module.exports = { connectDB };
