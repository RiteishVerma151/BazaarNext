import express from "express";
import passport from "passport";
import {
  register,
  login,
  logout,
} from "../controllers/authController.js";
import {
  googleAuthSuccess,
  googleAuthFailure,
} from "../controllers/googleAuthController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/api/auth/google/failure",
  }),
  googleAuthSuccess,
);

router.get("/google/failure", googleAuthFailure);

export default router;
