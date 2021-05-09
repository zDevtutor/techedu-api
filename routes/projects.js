const express = require("express");
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  projectPhotoUpload,
} = require("../controllers/projects");

const Project = require("../models/Project");

// Include other resource routers
const reviewRouter = require("./reviews");

const router = express.Router({ mergeParams: true });

// Middlewares
const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

// Re-route into other resource router
router.use("/:projectId/reviews", reviewRouter);

// Photo Upload
router
  .route("/:id/photo")
  .put(protect, authorize("student"), projectPhotoUpload);

router
  .route("/")
  .get(
    advancedResults(Project, {
      path: "user category reviews",
      select: "name email title text rating",
    }),
    getProjects
  )
  .post(protect, authorize("student"), createProject);

router
  .route("/:id")
  .get(getProject)
  .put(protect, authorize("student"), updateProject)
  .delete(protect, authorize("student"), deleteProject);

module.exports = router;
