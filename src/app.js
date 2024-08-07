import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: "20KB" }));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Routes import section
import userRouter from "./routes/user.routes.js";

//Routes declaration section
app.use("/api/v1/users", userRouter);

export { app };
