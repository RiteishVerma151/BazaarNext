import jwt from "jsonwebtoken";

export const googleAuthSuccess = (req, res) => {
  try {
    if (!req.user) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/auth?error=google_auth_failed`,
      );
    }

    const token = jwt.sign(
      { userId: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.redirect(
      `${process.env.FRONTEND_URL}/auth?oauth=success`,
    );
  } catch (error) {
    console.error("Google OAuth callback error:", error.message);

    return res.redirect(
      `${process.env.FRONTEND_URL}/auth?error=google_auth_failed`,
    );
  }
};

export const googleAuthFailure = (req, res) => {
  return res.redirect(
    `${process.env.FRONTEND_URL}/auth?error=google_auth_failed`,
  );
};