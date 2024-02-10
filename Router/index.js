const express = require('express');
const router = express.Router();
const postsRouter = require('./posts');
const Post = require('../models/post');

router.get('/', async (req, res) => {
  const post = await Post.findOne().sort('-postedAt');
  if (!post) {
    return res.status(404).json({ error: 'No posts found' });
  }
  res.redirect(`/posts/${post._id}`);
});

router.use('/posts', postsRouter);

module.exports = router;