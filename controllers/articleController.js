const Article = require('../models/Article');

exports.createArticle = async (req, res) => {
  const {title, description, body, author} = req.body;

  try {
    const articles = await Article.create({title, description, body, author});
    
    res.status(202).json(articles);
  } catch (error) {

    res.status(404).json({error: error.message});
  };
};

exports.getArticles = async (req, res) => {
  try {
    const articles = await Article.find({});
    res.status(200).json({success: true, articles});
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
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
  } catch (error) {
    res.status(500).json({ success: false, error: errpr.message});
  }
};


exports.updatePost = async (req, res) => {
  const post = await Article.findByIdAndUpdate(req.params.id, req.body);
  res.status(200).json(post);
};

exports.deletePost = async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.status(204).json();
};
        