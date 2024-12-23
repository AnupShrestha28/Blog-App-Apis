import express from "express";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";

const app = express();
app.use(express.json());

// User Routes
app.use("/api/users", userRoutes);

// Blog Routes
app.use("/api/posts", postRoutes);

export default app;
