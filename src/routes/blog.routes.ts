import { Router } from 'express';
import BlogController from '../controllers/blog.controller';
import verifyToken from '../middlewares/verify-token';
import adminCheck from '../middlewares/admin-check';

const blogRouter = Router();

// Create a new blog post
blogRouter.post('/posts', verifyToken, adminCheck, BlogController.createPost);

// Get all blog posts
blogRouter.get('/posts', BlogController.getAllPosts);

// Get a specific blog post by ID
blogRouter.get('/posts/:id', BlogController.getPostById);

// Update a blog post
blogRouter.put('/posts/:id', verifyToken, adminCheck, BlogController.updatePost);

// Delete a blog post
blogRouter.delete('/posts/:id', verifyToken, adminCheck, BlogController.deletePost);

export default blogRouter;
