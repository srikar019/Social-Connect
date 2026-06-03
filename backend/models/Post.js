const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  handle: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
});

const PostSchema = new mongoose.Schema({
  text: {
    type: String,
    trim: true,
  },
  image: {
    type: String, // Base64 data string or image link
  },
  // Creator fields cached on post to avoid joins for faster rendering
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  handle: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  // List of handles/names of users who liked the post to show who liked it
  likes: {
    type: [String],
    default: [],
  },
  // List of comment objects
  comments: {
    type: [CommentSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Validation to ensure at least one of text or image is provided
PostSchema.pre('validate', function (next) {
  if (!this.text && !this.image) {
    next(new Error('Post must contain either text or an image.'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Post', PostSchema);
