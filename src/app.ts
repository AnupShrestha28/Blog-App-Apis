import express from "express";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import commentRoutes from "./routes/commentRoutes";

const app = express();
app.use(express.json());

// User Routes
app.use("/api/users", userRoutes);

// Blog and Comment routes
app.use("/api/posts", postRoutes, commentRoutes);

export default app;
