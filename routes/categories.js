const express = require("express");
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  deleteCategories,
} = require("../controllers/categories");

// Include other resource routers
const projectRouter = require("./projects");

const router = express.Router();

// Re-route into other resource router
router.use("/:categoryId/projects", projectRouter);

router
  .route("/")
  .get(getCategories)
  .post(createCategory)
  .delete(deleteCategories);
router
  .route("/:id")
  .get(getCategory)
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;
