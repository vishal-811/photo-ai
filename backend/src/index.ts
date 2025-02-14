import express, { Request, Response } from "express";
import cors from "cors";
import rootRouter from "./routes";
import { initPassport } from "./passportConfig";
import passport from "passport";
import cookieParser from "cookie-parser";
import { authMiddleware } from "./middleware";

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

initPassport();
app.use(passport.initialize());

app.get("/health", (req: Request, res: Response) => {
  res.send("Server is Ok!");
});

app.use("/api/v1", rootRouter);

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
