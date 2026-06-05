const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  tempFixDb,
} = require("../controllers/jobController");

router.post("/", auth, createJob);

router.get("/", getJobs);

router.get("/temp-fix-db", tempFixDb);

router.get("/:id", getJobById);

router.put("/:id", auth, updateJob);

router.delete("/:id", auth, deleteJob);

module.exports = router;