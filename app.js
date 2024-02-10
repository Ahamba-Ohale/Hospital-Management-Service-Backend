const express = require('express');
const mongoose = require('mongoose');
const router = require('./routers');

const app = express();

mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use(router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});