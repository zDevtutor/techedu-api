const mongoose = require("mongoose");

const ProjectSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Please add a project title"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    url: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        "Please use a valid URL with HTTP or HTTPS",
      ],
    },
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    averageRating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [10, "Rating must can not be more than 10"],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Reverse populate with virtuals
ProjectSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "project",
  justOne: false,
});

module.exports = mongoose.model("Project", ProjectSchema);
