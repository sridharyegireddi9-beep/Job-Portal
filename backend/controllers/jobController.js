const Job = require("../models/Job");
const Application = require("../models/Application");

exports.createJob = async (req, res) => {
  try {
    if (req.user.role !== "recruiter" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access Denied: Only recruiters and admins can create jobs" });
    }

    const job = await Job.create({
      ...req.body,
      recruiter: req.user.id,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("recruiter", "name email");

    res.json(jobs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("recruiter", "name email");

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    if (req.user.role !== "admin" && (!job.recruiter || job.recruiter.toString() !== req.user.id)) {
      return res.status(403).json({
        message: "Access Denied: You do not own this job listing",
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    if (req.user.role !== "admin" && (!job.recruiter || job.recruiter.toString() !== req.user.id)) {
      return res.status(403).json({
        message: "Access Denied: You do not own this job listing",
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};