const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    min: 6
  },
  description: {
    type: String,
    required: true,
    max: 255,
  },
  featuredImage: {
    type: String,
    max: 1024,
    min: 8,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', PostSchema);