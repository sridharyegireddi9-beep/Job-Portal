const Job = require("../models/Job");

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

const User = require("../models/User");
exports.tempFixDb = async (req, res) => {
  try {
    const recruiters = await User.find({ role: "recruiter" });
    if (recruiters.length === 0) {
      return res.status(400).json({
        message: "No recruiter accounts found in the database. Please register a recruiter account first!",
      });
    }

    const { email } = req.query;
    let recruiter;
    if (email) {
      recruiter = recruiters.find(r => r.email === email);
      if (!recruiter) {
        return res.status(400).json({
          message: `No recruiter found with email: ${email}`,
          availableRecruiters: recruiters.map(r => r.email),
        });
      }
    } else {
      recruiter = recruiters[0];
    }

    const result = await Job.updateMany(
      { $or: [{ recruiter: { $exists: false } }, { recruiter: null }] },
      { recruiter: recruiter._id }
    );

    res.json({
      message: "Database successfully updated",
      recruiterAssigned: {
        id: recruiter._id,
        name: recruiter.name,
        email: recruiter.email,
      },
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      availableRecruiters: recruiters.map(r => r.email),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};