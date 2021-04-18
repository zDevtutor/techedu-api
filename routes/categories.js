const express = require("express");
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  deleteCategories,
} = require("../controllers/categories");
const router = express.Router();

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
