const Article = require('../models/Article');

exports.createArticle = async (req, res) => {
  const { title, description, body, author } = req.body;

  const article = new Article({ title, description, body, author });

  try {
    await article.save();
    res.status(201).json({ success: true, article });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.getArticles = async (req, res) => {
  try {
    const articles = await Article.find({});
    res.status(200).json({ success: true, articles });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getArticle = async (req, res) => {
  const { id } = req.params;

  try {
    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({ success: false, error: 'Article not found' });
    }

    res.status(200).json({ success: true, article });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message});
  }
};






        