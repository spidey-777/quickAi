import express from 'express';
// We import the controller directly. No need for the custom auth middleware.
import { backgroundRemove, generateArticle, generateBlogTitle, generateImage, removeobject, reviewResume } from '../controllers/aiControllers.js';
import { upload } from '../configs/multer.js';

const aiRoutes = express.Router();

// The route is already protected by `requireAuth` in server.js.
// We can just call the controller.
aiRoutes.post('/generate-article', generateArticle);
aiRoutes.post('/generate-blog-title', generateBlogTitle);
aiRoutes.post('/generate-image', generateImage);
aiRoutes.post('/revome-image-background',upload.single('image'),backgroundRemove);
aiRoutes.post('/remove-image-object',upload.single('image'), removeobject);
aiRoutes.post('/resume-review',upload.single('resume'), reviewResume);

export default aiRoutes;
