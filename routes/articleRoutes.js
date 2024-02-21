const express = require('express');
const router = express.Router();

const {
    createArticle, 
    getArticles, 
    getArticle, 
    updatePost, 
    deletePost
} = require('../controllers/articleController');

router.post('/', createArticle);
router.get('/', getArticles);
router.get('/:id', getArticle);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

module.exports = router;