const {
	getAllJobs,
	createJob,
	getJob,
	updateJob,
	deleteJob,
} = require("../controllers/jobs");

const express = require("express");
const router = express.Router();

router.get("/", getAllJobs);
router.post("/", createJob);
router.get("/:id", getJob);
router.patch("/:id", updateJob);
router.delete("/:id", deleteJob);

module.exports = router;