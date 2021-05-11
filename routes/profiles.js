const express = require("express");
const {
  getProfiles,
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
  profilePhotoUpload,
} = require("../controllers/profiles");

const Profile = require("../models/Profile");

const router = express.Router();

// Middlewares
const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

// Photo Upload
router
  .route("/:id/photo")
  .put(protect, authorize("student"), profilePhotoUpload);

router
  .route("/")
  .get(advancedResults(Profile, { path: "user", select: "name" }), getProfiles)
  .post(protect, authorize("student"), createProfile);

router
  .route("/:id")
  .get(getProfile)
  .put(protect, authorize("student"), updateProfile)
  .delete(protect, authorize("student"), deleteProfile);

module.exports = router;
