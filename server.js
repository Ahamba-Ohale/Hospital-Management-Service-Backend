const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


const postSchema = new mongoose.Schema({
    title: String,
    content: String
  });

const Post = mongoose.model('Post', postSchema);


const posts = [
  {
    id: 1,
    title: 'My first blog post',
    content: 'This is the content of my first blog post.'
  },
  {
    id: 2,
    title: 'My second blog post',
    content: 'This is the content of my second blog post.'
  }
];


app.get('/posts', async (req, res) => {
    const posts = await Post.find({});
    res.json(posts);
  });

app.get('/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).send('Post not found.');
  res.json(post);
});

app.post('/posts', (req, res) => {
  const post = {
    id: posts.length + 1,
    title: req.body.title,
    content: req.body.content
  };
  posts.push(post);
  res.status(201).json(post);
});

app.post('/posts', async (req, res) => {
    const post = new Post({
      title: req.body.title,
      content: req.body.content
    });
    await post.save();
    res.status(201).json(post);
  });

app.put('/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).send('Post not found.');
  post.title = req.body.title;
  post.content = req.body.content;
  res.json(post);
});



app.delete('/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).send('Post not found.');
  const index = posts.indexOf(post);
  posts.splice(index, 1);
  res.sendStatus(204);
});

app.get('/posts/:id', async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send('Post not found.');
    res.json(post);
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});