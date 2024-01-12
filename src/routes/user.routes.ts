import { Router } from "express";
import UserController from "../controllers/user.controller";
import verifyToken from "../middlewares/verify-token";
import adminCheck from "../middlewares/admin-check";

const userRouter = Router();

userRouter.get('/profile', verifyToken, UserController.getOwnProfile);

userRouter.get('/profile/:id', verifyToken, UserController.getUserById);

userRouter.get('/get-all-users', verifyToken, adminCheck, UserController.getAllUsers);

userRouter.post('/sign-up', UserController.signUp);

userRouter.post('/login', UserController.login);

userRouter.post('/forgot-password', UserController.forgotPassword);

userRouter.post('/verify', UserController.verifyOtp);

userRouter.post('/send-otp', verifyToken, UserController.sendVerificationOtp);

userRouter.post('/change-password', verifyToken, UserController.changePassword);

userRouter.post('/update', verifyToken, UserController.updateProfile);

export default userRouter;
