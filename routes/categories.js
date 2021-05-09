const express = require("express");
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  deleteCategories,
  categoryPhotoUpload,
} = require("../controllers/categories");

const Category = require("../models/Category");
const advancedResults = require("../middleware/advancedResults");

// Include other resource routers
const projectRouter = require("./projects");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

// Re-route into other resource router
router.use("/:categoryId/projects", projectRouter);

router
  .route("/:id/photo")
  .put(protect, authorize("admin"), categoryPhotoUpload);

router
  .route("/")
  .get(advancedResults(Category, "projects"), getCategories)
  .post(protect, authorize("admin"), createCategory)
  .delete(protect, authorize("admin"), deleteCategories);
router
  .route("/:id")
  .get(getCategory)
  .put(protect, authorize("admin"), updateCategory)
  .delete(protect, authorize("admin"), deleteCategory);

module.exports = router;
