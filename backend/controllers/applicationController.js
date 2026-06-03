const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");

exports.applyJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobId } = req.body;

    // Check if user already applied
    const alreadyApplied = await Application.findOne({ user: userId, job: jobId });
    if (alreadyApplied) {
      return res.status(400).json({ message: "You have already applied for this job" });
    }

    // Get user's resume
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const application = await Application.create({
      user: userId,
      job: jobId,
      resume: user.resume || req.body.resume || "",
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { role } = req.user;

    if (role === "recruiter") {
      // Find all jobs created by this recruiter
      const jobs = await Job.find({ recruiter: userId });
      const jobIds = jobs.map((job) => job._id);

      // Find applications for these jobs
      const applications = await Application.find({ job: { $in: jobIds } })
        .populate("job")
        .populate("user", "name email resume");

      return res.json(applications);
    } else if (role === "admin") {
      // Admins see all applications
      const applications = await Application.find()
        .populate("job")
        .populate("user", "name email resume");
      return res.json(applications);
    } else {
      // Standard user sees their own applications
      const applications = await Application.find({ user: userId })
        .populate("job");
      return res.json(applications);
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;
    const userId = req.user.id;
    const { role } = req.user;

    const application = await Application.findById(applicationId).populate("job");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Ensure the user is a recruiter of this job or an admin
    if (role !== "admin" && application.job.recruiter.toString() !== userId) {
      return res.status(403).json({ message: "Access Denied: You do not own this job listing" });
    }

    application.status = status;
    await application.save();

    res.json({ message: "Application status updated successfully", application });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};