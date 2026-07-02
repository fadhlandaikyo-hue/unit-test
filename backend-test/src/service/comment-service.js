import {prismaClient} from "../application/database.js";
import {validate} from "../validation/validation.js";
import {ResponseError} from "../error/response-error.js";
import {
    createInspectionCommentValidation,
    createInspectionPostValidation,
    deleteInspectionCommentValidation,
    deleteInspectionPostValidation,
    getInspectionPostValidation,
    listInspectionPostValidation
} from "../validation/comment-validation.js";

const sectionOrder = ["chukan", "kansei"];

const getSectionModel = (section) => {
    if (section === "chukan") {
        return {
            post: prismaClient.chukanInspectionPost,
            comment: prismaClient.chukanInspectionComment
        };
    }

    if (section === "kansei") {
        return {
            post: prismaClient.kanseiInspectionPost,
            comment: prismaClient.kanseiInspectionComment
        };
    }

    throw new ResponseError(400, "section is invalid");
};

const toCommentResponse = (comment) => ({
    id: comment.id,
    post_id: comment.post_id,
    author: comment.author,
    text: comment.content,
    created_at: comment.created_at
});

const toPostResponse = (post, section) => ({
    id: post.id,
    project_id: post.project_id,
    section,
    author: post.author,
    text: post.content,
    created_at: post.created_at,
    comments: (post.comments ?? []).map(toCommentResponse)
});

const listPostsBySection = async (projectId, section) => {
    const model = getSectionModel(section);

    const posts = await model.post.findMany({
        where: {
            project_id: projectId
        },
        orderBy: {
            created_at: "desc"
        },
        include: {
            comments: {
                orderBy: {
                    created_at: "asc"
                }
            }
        }
    });

    return posts.map((post) => toPostResponse(post, section));
};

const checkPostMustExists = async (section, postId) => {
    const model = getSectionModel(section);
    const validatedPostId = validate(getInspectionPostValidation, postId);

    const post = await model.post.findUnique({
        where: {
            id: validatedPostId
        }
    });

    if (!post) {
        throw new ResponseError(404, "post is not found");
    }

    return {
        model,
        post
    };
};

const listPosts = async (request) => {
    const filter = validate(listInspectionPostValidation, request);

    if (filter.section) {
        return listPostsBySection(filter.project_id, filter.section);
    }

    const sectionResults = await Promise.all(
        sectionOrder.map((section) => listPostsBySection(filter.project_id, section))
    );

    return sectionResults
        .flat()
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

const createPost = async (request) => {
    const postRequest = validate(createInspectionPostValidation, request);
    const model = getSectionModel(postRequest.section);

    const createdPost = await model.post.create({
        data: {
            project_id: postRequest.project_id,
            author: postRequest.author?.trim() || "Anonymous",
            content: postRequest.text
        },
        include: {
            comments: {
                orderBy: {
                    created_at: "asc"
                }
            }
        }
    });

    return toPostResponse(createdPost, postRequest.section);
};

const createComment = async (postId, request) => {
    const commentRequest = validate(createInspectionCommentValidation, request);
    const {model, post} = await checkPostMustExists(commentRequest.section, postId);

    const createdComment = await model.comment.create({
        data: {
            post_id: post.id,
            author: commentRequest.author?.trim() || "Anonymous",
            content: commentRequest.text
        }
    });

    return toCommentResponse(createdComment);
};

const deletePost = async (request) => {
    const deleteRequest = validate(deleteInspectionPostValidation, request);
    const {model} = await checkPostMustExists(deleteRequest.section, deleteRequest.postId);

    await model.post.delete({
        where: {
            id: deleteRequest.postId
        }
    });

    return {
        id: deleteRequest.postId
    };
};

const deleteComment = async (request) => {
    const deleteRequest = validate(deleteInspectionCommentValidation, request);
    const {model} = await checkPostMustExists(deleteRequest.section, deleteRequest.postId);

    const comment = await model.comment.findFirst({
        where: {
            id: deleteRequest.commentId,
            post_id: deleteRequest.postId
        }
    });

    if (!comment) {
        throw new ResponseError(404, "comment is not found");
    }

    await model.comment.delete({
        where: {
            id: deleteRequest.commentId
        }
    });

    return {
        id: deleteRequest.commentId
    };
};

export default {
    listPosts,
    createPost,
    createComment,
    deletePost,
    deleteComment
};