import express from "express";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import commentRoutes from "./routes/commentRoutes";
import imageRoutes from "./routes/imageRoutes";
import userProfileRoutes from "./routes/userProfileRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Auth and User profile Routes
app.use("/api/users", userRoutes, userProfileRoutes);

// Post, Comment, and Image Routes
app.use("/api/posts", postRoutes, commentRoutes, imageRoutes);

app.use(errorHandler);

export default app;
