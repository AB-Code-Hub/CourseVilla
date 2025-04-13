const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    title: {
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

    category: {
      type: String,
      enum: [  'Web Development',
        'Mobile Development',
        'Data Science',
        'Design',
        'Business',
        'Marketing'],
      default: null,
    },

    thumbnail: {
      type: String,
      default: null,
    },
    price: {
      type: String,
      default: null,
    },
    discount: {
      type: String,
      default: null,
    },
    duration: {
      type: String,
      default: null,
    },
    topic: {
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
