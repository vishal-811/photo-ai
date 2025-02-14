import { Router, Request, Response } from "express";
import passport from "passport";
import Jwt from "jsonwebtoken";
import { apiResponse } from "../lib/apiResponse";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req: Request, res: Response): any => {
    if (!req.user) {
      return res.redirect("http://localhost:5173/login");
    }
    const user = req.user as { id: string; name: string; email: string };

    const token = Jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET!
    );

    if (!token) {
      return apiResponse(res, 500, "Internal server error");
    }
    res.cookie("token", token);
    return apiResponse(res, 201, "signin successfull");
  }
);

export default router;
