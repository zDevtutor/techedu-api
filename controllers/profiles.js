const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Profile = require("../models/Profile");

// @desc    Get All Profiles
// @route   GET /api/v1/profiles
// @access  Public
exports.getProfiles = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get Single Profile
// @route   GET /api/v1/auth/profiles/:id
// @access  Public
exports.getProfile = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findById(req.params.id);

  if (!profile) {
    return next(
      new ErrorResponse(`Profile not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: profile });
});

// @desc    Create New Profile
// @route   POST /api/v1/auth/profiles
// @access  Private/Student
exports.createProfile = asyncHandler(async (req, res, next) => {
  // Add user to profile
  req.body.user = req.user.id;

  // Check for user role if it's student
  if (req.user.role !== "student") {
    return next(
      new ErrorResponse(
        `User role ${req.user.role} is not authorized to create a project`,
        401
      )
    );
  }

  const profile = await Profile.create(req.body);

  res.status(201).json({ success: true, data: profile });
});

// @desc    Update Profile
// @route   PUT /api/v1/auth/profiles/:id
// @access  Private/Student
exports.updateProfile = asyncHandler(async (req, res, next) => {
  // Check if profile exist
  let profile = await Profile.findById(req.params.id);

  if (!profile) {
    return next(
      new ErrorResponse(`Profile not found with id ${req.params.id}`, 404)
    );
  }

  // Makesure user is profile owner
  if (profile.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this profile`,
        401
      )
    );
  }

  profile = await Profile.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: profile });
});

// @desc    Delete Profile
// @route   DELETE /api/v1/auth/profiles/:id
// @access  Private/Student
exports.deleteProfile = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findById(req.params.id);

  if (!profile) {
    return next(
      new ErrorResponse(`Profile not found with id ${req.params.id}`, 404)
    );
  }

  // Makesure user is profile owner
  if (profile.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this profile`,
        401
      )
    );
  }

  await profile.remove();

  res.status(200).json({ success: true, data: {} });
});

// @desc    Upload Photo For Profile
// @route   PUT /api/v1/auth/profiles/:id/photo
// @access  Private/Student
exports.profilePhotoUpload = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findById(req.params.id);

  if (!profile) {
    return next(
      new ErrorResponse(`Profile not found with id ${req.params.id}`, 404)
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
  file.name = `photo_${profile._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Profile.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({ success: true, data: file.name });
  });
});
