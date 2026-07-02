import Joi from "joi";

const sectionValues = ["chukan", "kansei"];

const listInspectionPostValidation = Joi.object({
    project_id: Joi.number().positive().required(),
    section: Joi.string().valid(...sectionValues).optional()
});

const createInspectionPostValidation = Joi.object({
    project_id: Joi.number().positive().required(),
    section: Joi.string().valid(...sectionValues).required(),
    author: Joi.string().max(100).allow("").optional(),
    text: Joi.string().max(5000).required()
});

const getInspectionPostValidation = Joi.number().positive().required();

const createInspectionCommentValidation = Joi.object({
    section: Joi.string().valid(...sectionValues).required(),
    author: Joi.string().max(100).allow("").optional(),
    text: Joi.string().max(5000).required()
});

const deleteInspectionPostValidation = Joi.object({
    postId: Joi.number().positive().required(),
    section: Joi.string().valid(...sectionValues).required()
});

const deleteInspectionCommentValidation = Joi.object({
    postId: Joi.number().positive().required(),
    commentId: Joi.number().positive().required(),
    section: Joi.string().valid(...sectionValues).required()
});

export {
    listInspectionPostValidation,
    createInspectionPostValidation,
    getInspectionPostValidation,
    createInspectionCommentValidation,
    deleteInspectionPostValidation,
    deleteInspectionCommentValidation
};