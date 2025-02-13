import { Router, Request, Response } from "express";
import passport from "passport";
import Jwt from "jsonwebtoken";
import { apiResponse } from "../lib/apiResponse";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get("/google/callback", (req: Request, res: Response) => {
  passport.authenticate("google", { session: false }, (error, user) => {
    if (error || !user) {
      res.redirect("http://localhost:5173/api/v1/auth/google");
      return;
    }

    const token = Jwt.sign(
      { id: user.id, name: user.displayName, email: user.emails[0].value },
      process.env.JWT_SECRET!
    );
    if (!token) {
      return apiResponse(res, 500, "Internal server error");
    }

    return apiResponse(res, 201, { token: token });
  });
});

export default router;
