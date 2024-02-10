const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  postedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', postSchema);