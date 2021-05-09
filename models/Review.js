const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a review title"],
    maxlength: 100,
  },
  text: {
    type: String,
    required: [true, "Please add some text"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "Please add a rating between 1 and 10"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  project: {
    type: mongoose.Schema.ObjectId,
    ref: "Project",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

// Prevent instructor from submitting more than one review per project
ReviewSchema.index({ project: 1, user: 1 }, { unique: true });

// Static method to get average rating and save
ReviewSchema.statics.getAverageRating = async function (projectId) {
  const obj = await this.aggregate([
    {
      $match: { project: projectId },
    },
    {
      $group: {
        _id: "$project",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  try {
    await this.model("Project").findByIdAndUpdate(projectId, {
      averageRating: obj[0].averageRating,
    });
  } catch (err) {
    console.log(err);
  }
};

// Call getAverageRating after save
ReviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.project);
});

// Call getAverageRating before remove
ReviewSchema.pre("remove", function () {
  this.constructor.getAverageRating(this.project);
});

module.exports = mongoose.model("Review", ReviewSchema);
