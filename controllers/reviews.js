const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Review = require("../models/Review");
const Project = require("../models/Project");

// @desc    Get All Reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/projects/:projectId/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.projectId) {
    const reviews = await Review.find({
      project: req.params.projectId,
    }).populate({
      path: "user project",
      select: "name email title description",
    });

    res
      .status(200)
      .json({ success: true, count: reviews.length, data: reviews });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get Single Review
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: review });
});

// @desc    Create New Review
// @route   POST /api/v1/projects/:projectId/reviews
// @access  Private/Instructor
exports.createReview = asyncHandler(async (req, res, next) => {
  // Add project to review
  req.body.project = req.params.projectId;
  // Add user to review
  req.body.user = req.user.id;

  // Check for project exist
  const project = await Project.findById(req.params.projectId);

  if (!project) {
    return next(
      new ErrorResponse(
        `Project not found with id ${req.params.projectId}`,
        404
      )
    );
  }

  // Check for user role if it's Instructor
  if (req.user.role !== "instructor") {
    return next(
      new ErrorResponse(
        `User role ${req.user.role} is not authorized to create a review`,
        401
      )
    );
  }

  const review = await Review.create(req.body);

  res.status(201).json({ success: true, data: review });
});

// @desc    Update Review
// @route   PUT /api/v1/reviews/:id
// @access  Private/Instructor
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id ${req.params.id}`, 404)
    );
  }

  // Makesure user is review owner
  if (review.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this review`,
        401
      )
    );
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: review });
});

// @desc    Delete Review
// @route   DELETE /api/v1/reviews/:id
// @access  Private/Instructor
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id ${req.params.id}`, 404)
    );
  }

  // Makesure user is review owner
  if (review.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this review`,
        401
      )
    );
  }

  await review.remove();

  res.status(200).json({ success: true, data: {} });
});
