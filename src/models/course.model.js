const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: null,
    },

    name: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },

   image: {
        type: String,
        default: null,
    },
    price: {
      type: String,
      deafult: null,
    },
    discount: {
      type: String,
      default: null,
    },
    duration: {
      type: String,
      default: null,
    },
    topics: {
      type: String,
      default: null,
    },
    videos: [
      {
        type: Array,
        default: null,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
