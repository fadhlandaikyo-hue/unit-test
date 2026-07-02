import express from "express";
import userController from "../controller/user-controller.js";
import healthController from "../controller/health-controller.js";
import commentController from "../controller/comment-controller.js";
import {getProgress, updateProgress} from "../controller/progress-controller.js";
import {getProjectDate, updateProjectDate} from "../controller/project-date-controller.js";
import {getChecklist, saveChecklist} from "../controller/inspection-controller.js";

const publicRouter = new express.Router();
publicRouter.post('/api/users', userController.register);
publicRouter.post('/api/users/login', userController.login);
publicRouter.get('/ping', healthController.ping);

publicRouter.get('/api/inspection-posts', commentController.listPosts);
publicRouter.post('/api/inspection-posts', commentController.createPost);
publicRouter.delete('/api/inspection-posts/:postId', commentController.deletePost);
publicRouter.post('/api/inspection-posts/:postId/comments', commentController.createComment);
publicRouter.delete('/api/inspection-posts/:postId/comments/:commentId', commentController.deleteComment);


publicRouter.get('/api/projects/:id/progress', getProgress)
publicRouter.patch('/api/projects/:id/progress', updateProgress)
publicRouter.get('/api/projects/:id/date', getProjectDate)
publicRouter.patch('/api/projects/:id/date', updateProjectDate)

publicRouter.get('/api/projects/:id/checklist', getChecklist)
publicRouter.patch('/api/projects/:id/checklist', saveChecklist)

export {
    publicRouter
}
