const { BadRequestError, NotFoundError } = require("../errors");
const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");

const getAllJobs = async (req, res) => {
	const { userId } = req.user;
	const jobs = await Job.find({ createdBy: userId }).sort("createdAt");
	res.status(200).json({ Hits: jobs.length, jobs: jobs });
};

const getJob = async (req, res) => {
	const { userId } = req.user;
	const { id: jobId } = req.params;
	const job = await Job.find({ _id: jobId, createdBy: userId });
	if (!job) throw new NotFoundError(`Job not found`);
	res.status(StatusCodes.OK).json(job);
};

const createJob = async (req, res) => {
	const { userId } = req.user;
	const job = await Job.create({ ...req.body, createdBy: userId });
	res.status(StatusCodes.CREATED).json(job);
};

const updateJob = async (req, res) => {
	const { userId } = req.user;
	const { id: jobId } = req.params;
	const query = { _id: jobId, createdBy: userId };
	const { company, position } = req.body;

	if (company.trim() === "" || position.trim() === "")
		throw new BadRequestError("Please provide all the credentials");

	const job = await Job.findOneAndUpdate(query, req.body, {
		new: true,
		runValidators: true,
	});

	if (!job) throw new NotFoundError(`Job not found`);
	res.status(StatusCodes.OK).json(job);
};

const deleteJob = async (req, res) => {
	const { userId } = req.user;
	const { id: jobId } = req.params;
	const job = await Job.findOneAndDelete({ _id: jobId, createdBy: userId });
	if (!job) throw new NotFoundError(`Job not found`);
	res.status(StatusCodes.OK).json({ job }); //& It's our choice whether we want to send somthing to the frontend.
};

module.exports = { getAllJobs, createJob, updateJob, deleteJob, getJob };
