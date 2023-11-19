const express = require('express');
const router = express.Router();
const middleware = require('../middleware/authMiddleware');
const blogController = require('../controllers/blogControllers');

router.post('/api/v1/blog', middleware.verifyToken, blogController.createBlog);

router.patch('/api/v1/blog', middleware.verifyToken, blogController.updateBlog);

router.delete('/api/v1/blog/:id', middleware.verifyToken, blogController.deleteBlog);

router.post('/api/v1/blog/vote/:blogId/:voteType', middleware.verifyToken, blogController.addVote);

router.post('/api/v1/blog/comment', middleware.verifyToken, blogController.addComment);

router.post('/api/v1/blog/comment/react', middleware.verifyToken, blogController.addReact);

module.exports = router;