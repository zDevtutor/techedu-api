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

// Photo Upload
router.route("/:id/photo").put(projectPhotoUpload);

router.route("/").get(getProjects).post(createProject);
router.route("/:id").get(getProject).put(updateProject).delete(deleteProject);

module.exports = router;
