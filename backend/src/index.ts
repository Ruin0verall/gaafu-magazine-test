// Core dependencies
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Middleware imports
import { errorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/requestLogger";

// Route imports
import articlesRouter from "./routes/articles";
import categoriesRouter from "./routes/categories";

// Initialize environment variables
dotenv.config();

// Create Express application
const app = express();

// Global middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// API routes
app.use("/api/articles", articlesRouter);
app.use("/api/categories", categoriesRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Global error handling
app.use(errorHandler);

// Server initialization
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
