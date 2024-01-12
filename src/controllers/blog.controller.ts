import { prisma } from '../index';
import { Request, Response } from 'express';

export default class BlogController {
    static async createPost(req: Request, res: Response): Promise<Response> {
        try {
            const { title, content, imageUrl } = req.body;

            if (!title || !content || !imageUrl) {
                return res.status(400).json({ success: true, message: 'Required body params are missing' });
            }

            const user = req.user!;

            const post = await prisma.post.create({
                data: {
                    userId: user.id,
                    title,
                    content,
                    imageUrl,
                },
            });

            return res.status(200).json({ success: true, data: post });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: 'Something went wrong',
            });
        }
    }

    static async getAllPosts(req: Request, res: Response): Promise<Response> {
        try {
            // Pagination parameters
            const { page = 1, limit = 10 } = req.query;
            const parsedPage = parseInt(page.toString(), 10);
            const parsedLimit = parseInt(limit.toString(), 10);

            // Calculate the offset based on the page and limit
            const offset = (parsedPage - 1) * parsedLimit;
            
            const posts = await prisma.post.findMany({
                skip: offset,
                take: parsedLimit,
                orderBy: {
                    createdAt: 'desc',
                }
            });

            return res.status(200).send({ success: true, data: { posts } });
        } catch (error) {
            return res.status(500).send({ success: false, message: 'Something went wrong' });
        }
    }

    static async getPostById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;

            const post = await prisma.post.findUnique({ where: { id } });

            if (!post) {
                return res.status(404).send({ success: false, message: 'Blog Post Not Found' });
            }

            return res.status(200).send({ success: true, data: post });
        } catch (error) {
            return res.status(500).send({ success: false, message: 'Something went wrong' });
        }
    }

    static async updatePost(req: Request, res: Response): Promise<Response> {
        try {
            const { title, content, imageUrl } = req.body;

            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ success: true, message: 'Post ID is required for this operation' });
            }

            if (!title || !content || !imageUrl) {
                return res.status(400).json({ success: true, message: 'Required body params are missing' });
            }

            const user = req.user!;

            const post = await prisma.post.findFirst({ where: { id, userId: user.id } })

            if (!post) {
                return res.status(404).json({ success: true, message: 'Post not found' });
            }

            if (post.userId !== user.id) {
                return res.status(403).json({ success: true, message: 'Unauthorized Access' });
            }

            const updatedPost = await prisma.post.update({
                where: { id },
                data: {
                    title,
                    content,
                    imageUrl,
                },
            });

            return res.status(200).json({ success: true, data: updatedPost });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Something went wrong',
            });
        }
    }

    static async deletePost(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ success: true, message: 'Post ID is required for this operation' });
            }

            const user = req.user!;

            const post = await prisma.post.findFirst({ where: { id, userId: user.id } })

            if (!post) {
                return res.status(404).json({ success: true, message: 'Post not found' });
            }

            if (post.userId !== user.id) {
                return res.status(403).json({ success: true, message: 'Unauthorized Access' });
            }

            await prisma.post.delete({
                where: { id },
            });

            return res.status(200).json({ success: true, message: 'Post deleted' });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Something went wrong',
            });
        }
    }
}
