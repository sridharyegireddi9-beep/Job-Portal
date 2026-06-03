const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const role = require("../middleware/roleMiddleware");

const {
  getUsers,
  deleteJob,
} = require("../controllers/adminController");

router.get(
  "/users",
  auth,
  role("admin"),
  getUsers
);

router.delete(
  "/job/:id",
  auth,
  role("admin"),
  deleteJob
);

module.exports = router;