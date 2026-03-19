// routes/auth.routes.js
const express = require("express");
const { registerUser, loginUser, verifyEmail, resendVerification, logoutUser, getMe, refreshAccessToken} = require("../controllers/auth.controller");
const protect = require("../middlewares/auth.middleware");
const authRouter = express.Router();

authRouter.post("/register",registerUser)
authRouter.post("/login",loginUser)
authRouter.get("/verify/:token", verifyEmail);
authRouter.post("/resend-verification", resendVerification);
authRouter.post("/logout",protect, logoutUser);
authRouter.get("/me", protect, getMe);
authRouter.post("/refresh", refreshAccessToken);
module.exports = authRouter; 