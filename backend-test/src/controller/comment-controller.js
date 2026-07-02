import commentService from "../service/comment-service.js";

const listPosts = async (req, res, next) => {
    try {
        const request = {
            project_id: req.query.project_id ?? req.query.projectId,
            section: req.query.section
        };

        const result = await commentService.listPosts(request);

        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
};

const createPost = async (req, res, next) => {
    try {
        const request = req.body;

        const result = await commentService.createPost(request);

        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
};

const createComment = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const request = req.body;

        const result = await commentService.createComment(postId, request);

        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
};

const deletePost = async (req, res, next) => {
    try {
        const request = {
            postId: req.params.postId,
            section: req.query.section
        };

        await commentService.deletePost(request);

        res.status(200).json({
            data: "OK"
        });
    } catch (e) {
        next(e);
    }
};

const deleteComment = async (req, res, next) => {
    try {
        const request = {
            postId: req.params.postId,
            commentId: req.params.commentId,
            section: req.query.section
        };

        await commentService.deleteComment(request);

        res.status(200).json({
            data: "OK"
        });
    } catch (e) {
        next(e);
    }
};

export default {
    listPosts,
    createPost,
    createComment,
    deletePost,
    deleteComment
};