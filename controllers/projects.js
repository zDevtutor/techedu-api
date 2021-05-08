const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Project = require("../models/Project");
const Category = require("../models/Category");

// @desc    Get All Projects
// @route   GET /api/v1/projects
// @route   GET /api/v1/categories/:categoryId/projects
// @access  Public
exports.getProjects = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  if (req.params.categoryId) {
    query = Project.find({ category: req.params.categoryId })
      .populate({
        path: "user",
        select: "name",
      })
      .populate({
        path: "category",
        select: "name",
      });
  } else {
    query = Project.find(JSON.parse(queryStr))
      .populate({
        path: "user",
        select: "name",
      })
      .populate({
        path: "category",
        select: "name",
      });
  }

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const fields = req.query.sort.split(",").join(" ");
    query = query.sort(fields);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Project.countDocuments();

  query = query.skip(startIndex).limit(limit);

  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  // Excuting query
  const projects = await query;

  res.status(200).json({
    success: true,
    count: projects.length,
    pagination,
    data: projects,
  });
});

// @desc    Get Single Project
// @route   GET /api/v1/projects/:id
// @access  Public
exports.getProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: project });
});

// @desc    Create New Project
// @route   POST /api/v1/categories/:categoryId/projects
// @access  Private
exports.createProject = asyncHandler(async (req, res, next) => {
  // Add category to project
  req.body.category = req.params.categoryId;
  // Add user to project
  req.body.user = req.user.id;

  // Check for category exist
  const category = await Category.findById(req.params.categoryId);

  if (!category) {
    return next(
      new ErrorResponse(
        `Category not found with id ${req.params.categoryId}`,
        404
      )
    );
  }

  // Check for user role if it's student
  if (req.user.role !== "student") {
    return next(
      new ErrorResponse(
        `User role ${req.user.role} is not authorized to create a project`,
        401
      )
    );
  }

  const project = await Project.create(req.body);

  res.status(200).json({ success: true, data: project });
});

// @desc    Update Project
// @route   PUT /api/v1/projects/:id
// @access  Private
exports.updateProject = asyncHandler(async (req, res, next) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id ${req.params.id}`, 404)
    );
  }

  // Makesure user is project owner
  if (project.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this project`,
        401
      )
    );
  }

  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: project });
});

// @desc    Delete Project
// @route   DELETE /api/v1/projects/:id
// @access  Private
exports.deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id ${req.params.id}`, 404)
    );
  }

  // Makesure user is project owner
  if (project.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this project`,
        401
      )
    );
  }

  await project.remove();

  res.status(200).json({ success: true, data: {} });
});

// @desc    Upload Photo For Project
// @route   DELETE /api/v1/projects/:id/photo
// @access  Private
exports.projectPhotoUpload = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check Image size
  if (file.size > process.env.MAX_FILE_SIZE) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_SIZE}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${project._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Project.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({ success: true, data: file.name });
  });
});
