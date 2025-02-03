import { Router } from "express";
import passport from "passport";
import { config } from "../config/app.config";
import { googleLoginCallback, register, login, logOut } from "../controllers/auth.controller";

const failedUrl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;

const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);

authRoutes.post("/logout", logOut);



authRoutes.get(
    "/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );
  
  authRoutes.get(
    "/google/callback",
    passport.authenticate("google", {
      failureRedirect: failedUrl,
    }),
    googleLoginCallback
  );
  
  export default authRoutes;