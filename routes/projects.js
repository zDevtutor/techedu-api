const express = require("express");
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  projectPhotoUpload,
} = require("../controllers/projects");

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");

// Photo Upload
router
  .route("/:id/photo")
  .put(protect, authorize("student"), projectPhotoUpload);

router.route("/").get(getProjects).post(protect, createProject);

router
  .route("/:id")
  .get(getProject)
  .put(protect, authorize("student"), updateProject)
  .delete(protect, authorize("student"), deleteProject);

module.exports = router;
