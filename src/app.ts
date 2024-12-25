import express from "express";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import commentRoutes from "./routes/commentRoutes";
import imageRoutes from "./routes/imageRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
app.use(express.json());
app.use("/uploads", express.static("uploads")); 

// User Routes
app.use("/api/users", userRoutes);

// Blog, Comment and Image routes
app.use("/api/posts", postRoutes, commentRoutes, imageRoutes);

app.use(errorHandler);

export default app;
