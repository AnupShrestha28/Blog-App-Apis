import express from "express";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import commentRoutes from "./routes/commentRoutes";
import imageRoutes from "./routes/imageRoutes";

const app = express();
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded images

// User Routes
app.use("/api/users", userRoutes);

// Blog, Comment and Image routes
app.use("/api/posts", postRoutes, commentRoutes, imageRoutes);


export default app;
