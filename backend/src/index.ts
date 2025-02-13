import express, {Request, Response} from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/health",(req: Request, res: Response) => {
    res.send("Server is Ok!")
})

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
