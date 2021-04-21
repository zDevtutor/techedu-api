const Category = require("../models/Category");

// @desc    Get All Categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();

    res
      .status(200)
      .json({ success: true, count: categories.length, data: categories });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Get Single Category
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: category });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Create New Category
// @route   POST /api/v1/categories
// @access  Private
exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);

    res.status(201).json({ success: true, data: category });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Update Category
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: category });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Delete Single Category
// @route   DELETE /api/v1/categories/:id
// @access  Private
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Delete All Categories
// @route   DELETE /api/v1/categories
// @access  Private
exports.deleteCategories = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Delete All Categories" });
};
