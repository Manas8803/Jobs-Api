//* Imports :

require("express-async-errors");
require("dotenv").config();
const express = require("express");
const app = express();
const authRouter = require("./routes/Auth");
const jobRouter = require("./routes/Jobs");
const { connectDB } = require("./db/connect");
const auth = require("./middleware/authentication");
const helmet = require("helmet");
const xss = require("xss");
const cors = require("cors");
const rateLimiter = require("express-rate-limit");

//* error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(cors());
// app.use(
// 	rateLimiter({
// 		windowMs: 20 * 60 * 1000, //& 15 minutes
// 		limit: 100, //& Limit each IP to 100 requests per `window` (here, per 15 minutes)
// 		message:
// 			"Too many accounts created from this IP, please try again after 15 minutes",
// 	})
// );


//* routers :
app.use(express.json());

app.get("/", (req, res) => {
	res.send("jobs api");
});
app.use("/jobs", auth, jobRouter);
app.use("/authentication", authRouter);
app.use(helmet());

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
const port = process.env.PORT || 8000;

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		app.listen(port, () =>
			console.log(`Server is listening on port ${port}...`)
		);
	} catch (error) {
		console.log(error);
	}
};

start();
