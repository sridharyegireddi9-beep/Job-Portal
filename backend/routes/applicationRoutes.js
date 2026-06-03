const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  applyJob,
  getApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");

router.post("/", auth, applyJob);
router.get("/", auth, getApplications);
router.put("/:id", auth, updateApplicationStatus);

module.exports = router;