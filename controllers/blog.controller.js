// creating post controller using sequelize orm

const { Post } = require('../models');

const LIMIT = 10;

class BlogController {
    createPost = async (req, res, next) => {
        const token = req.headers.authorization;

        if (token) {
            try {
                var payload = decodeToken(token);
                const newPost = new Post(req.body);
                newPost.userId = payload.id;
                const savedPost = await newPost.save();
                res.status(201).json(savedPost);
                console.log(savedPost);
                return;
            } catch (err) {
                res.status(500).json(err);
                console.log(err);
                return;
            }
        } else {
            res.status(401).json({
                message: 'You are not authorized to create a post',
            });
            return;
        }
    };

    getPostbyId = async (req, res, next) => {
        try {
            const post = await Post.findOne({
                where: {
                    id: req.query.id,
                },
            });
            !post && res.status(404).json('post not found');
            res.status(200).json(post);
            return;
        } catch (err) {
            res.status(500).json(err);
            console.log(err);
            return;
        }
    };

    getPosts = async (req, res, next) => {
        try {
            const posts = await Post.findAndCountAll({
                offset: req.query.pageNo ? req.query.pageNo * LIMIT : 0,
                limit: LIMIT,
            });
            res.status(200).json({
                total_posts: posts.count,
                posts: posts.rows,
            });
            return;
        } catch (err) {
            res.status(500).json(err);
            console.log(err);
            return;
        }
    };

    deletePost = async (req, res, next) => {
        const token = req.headers.authorization;

        try {
            const post = await Post.findOne({
                where: {
                    id: req.query.id,
                },
            });

            !post && res.status(404).json(' post not found');
            const payload = decodeToken(token);

            if (post.userId === payload.id) {
                await post.destroy();
                res.status(200).json('deleted successfully');

                return;
            } else {
                res.status(401).json({
                    message: 'You are not authorized to delete this post',
                });
                return;
            }
            // !post.userId === payload.id && res.status(401).json('you are not authorized')
        } catch (err) {
            res.status(500).json(err);
            console.log(err);
            return;
        }
    };

    updatePost = async (req, res, next) => {
        const token = req.headers.authorization;

        try {
            const post = await Post.findOne({
                where: {
                    id: req.query.id,
                },
            });

            !post && res.status(404).json('post not found');
            const payload = decodeToken(token);
            if (post.userId === payload.id) {
                post.update({
                    title: req.body.title,
                    content: req.body.content,
                    imageUrl: req.body.imageUrl,
                });

                res.status(200).json(post);
                return;
            } else {
                res.status(401).json({
                    message: 'You are not authorized to update',
                });
            }
        } catch (err) {
            res.status(500).json(err);
            console.log(err);
            return;
        }

        // Post.findOne({
        //     where: {
        //          id:_id
        //     }
        // }).then((Post) => {
        //     Post.update({
        //         title: req.body.title,
        //         content: req.body.content,
        //         imageUrl: req.body.image
        //     }).then((response) => {

        //         response.send(200).json('post updated successfully')
        //     } ).catch(() => {

        //         response.send(500).json('error updating post')
        //     })
        // }).catch(error => {
        //     response.send(500).json(error.message)
        // })
    };

    getPostByUser = async (req, res, next) => {
        const token = req.headers.authorization;
        !token && res.status(404).json('unauthorized access of users posts');

        try {
            const post = await Post.findAndCountAll({
                where: {
                    userId: req.query.id,
                },
                offset: req.query.pageNo ? req.query.pageNo * LIMIT : 0,
                limit: LIMIT,
            });
            !post && res.status(204).jsson('posts not found');

            res.status(200).json({
                total_posts: post.count,
                posts: post.rows,
            });
            return;
            // const payload = decodeToken(token)

            // if (post.userId === payload.id) {
            //     res.status(200).json(post);
            //     return;
            // } else {
            //     res.status(401).json({ message: "You are not authorized to view this post" });
            //     return;
            // }
        } catch (err) {
            res.status(500).json(err);
            console.log(err);
            return;
        }
    };
}

module.exports = new BlogController();
