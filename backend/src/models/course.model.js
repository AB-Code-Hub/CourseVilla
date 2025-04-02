const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    name: {
      type: String,
      default: null,
    },

    isDeleted: { 
      type: Boolean,
      default: false,
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
