const mongoose = require('mongoose');
const slugify = require('slugify');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

articleSchema.pre('validate', function (next) {
  if (!this.slug) {
    this.slug = slugify(this.title, { lower: true });
  }

  next();
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;