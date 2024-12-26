import dotenv from "dotenv";
import app from "./app";
import { PrismaClient } from "@prisma/client";
import { swaggerUi, swaggerSpec } from "./swagger";

dotenv.config();

const prisma = new PrismaClient();

prisma
  .$connect()
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.error("Database connection error:", err));

const PORT = process.env.PORT || 3000;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
