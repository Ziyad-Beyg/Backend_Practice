import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors"

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.subscribe(express.static("public"));
app.use(cookieParser());

// Router Imports
import userRouter from "./routes/user.routes.js"

// Routes Usage

app.use("/api/v1/user", userRouter)


export {app}