require('dotenv').config();
const express = require('express');
const app = express();

const {mongodb} = require('./src/utils/index');
mongodb.initialize();

const User = require('./src/models/User');
const Blog = require('./src/models/Blog');
const Tag = require('./src/models/Tag');
const Comment = require('./src/models/Comment');

const authRoutes = require('./src/routes/authRoutes');
const blogRoutes = require('./src/routes/blogRoutes');

require('./src/globals/index');

app.use(express.json());

app.use(authRoutes);
app.use(blogRoutes);


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});