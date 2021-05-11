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
  if (req.params.categoryId) {
    const projects = await Project.find({
      category: req.params.categoryId,
    }).populate({
      path: "user category",
      select: "name email",
    });

    res
      .status(200)
      .json({ success: true, count: projects.length, data: projects });
  } else {
    res.status(200).json(res.advancedResults);
  }
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
// @access  Private/Student
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

  res.status(201).json({ success: true, data: project });
});

// @desc    Update Project
// @route   PUT /api/v1/projects/:id
// @access  Private/Student
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
// @access  Private/Student
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
// @route   PUT /api/v1/projects/:id/photo
// @access  Private/Student
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
