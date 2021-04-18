// @desc    Get All Categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Show All Categories" });
};

// @desc    Get Single Category
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Show Category ${req.params.id}` });
};

// @desc    Create New Category
// @route   POST /api/v1/categories
// @access  Private
exports.createCategory = (req, res, next) => {
  res.status(201).json({ success: true, msg: "Create New Category" });
};

// @desc    Update Category
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updateCategory = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Update Category ${req.params.id}` });
};

// @desc    Delete Single Category
// @route   DELETE /api/v1/categories/:id
// @access  Private
exports.deleteCategory = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete Category ${req.params.id}` });
};

// @desc    Delete All Categories
// @route   DELETE /api/v1/categories
// @access  Private
exports.deleteCategories = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Delete All Categories" });
};
