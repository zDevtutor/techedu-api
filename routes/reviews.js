const express = require("express");
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviews");

const Review = require("../models/Review");

const router = express.Router({ mergeParams: true });

// Middlewares
const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(
    advancedResults(Review, {
      path: "user project",
      select: "name title description",
    }),
    getReviews
  )
  .post(protect, authorize("instructor"), createReview);

router
  .route("/:id")
  .get(getReview)
  .put(protect, authorize("instructor"), updateReview)
  .delete(protect, authorize("instructor"), deleteReview);

module.exports = router;
