import express from 'express'
import { getPublicCreations, getUserCreations, toggleLikeCreations } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/get-user-creations', getUserCreations);
userRouter.get('/get-published-creations', getPublicCreations);
userRouter.post('/toggle-like-creations', toggleLikeCreations);


export default userRouter;