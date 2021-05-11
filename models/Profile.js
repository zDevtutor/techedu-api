const mongoose = require("mongoose");

const ProfileSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  photo: {
    type: String,
    default: "no-photo.jpg",
  },
  location: String,
  bio: String,
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "Please use a valid URL with HTTP or HTTPS",
    ],
  },
  skills: {
    type: [String],
    required: true,
  },
  experience: {
    title: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    location: String,
    from: {
      type: Date,
      required: true,
    },
    to: Date,
    current: {
      type: Boolean,
      default: false,
    },
    description: String,
  },
  education: {
    school: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
    fieldofstudy: {
      type: String,
      required: true,
    },
    from: {
      type: Date,
      required: true,
    },
    to: Date,
    current: {
      type: Boolean,
      default: false,
    },
    description: String,
  },
  social: {
    youtube: String,
    twitter: String,
    facebook: String,
    linkedin: String,
    instagram: String,
  },
});

module.exports = mongoose.model("Profile", ProfileSchema);
