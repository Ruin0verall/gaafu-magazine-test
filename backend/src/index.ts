import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { supabase } from "./config/supabase";

import { errorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/requestLogger";
import articlesRouter from "./routes/articles";
import categoriesRouter from "./routes/categories";

// Initialize environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Routes
app.use("/api/articles", articlesRouter);
app.use("/api/categories", categoriesRouter);

// Basic test route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Test database connection
app.get("/api/test-db", async (req, res) => {
  try {
    const { data, error } = await supabase.from("articles").select("*");
    if (error) throw error;
    res.json({
      success: true,
      message: "Database connection successful",
      data,
    });
  } catch (error: any) {
    console.error("Database connection error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "An unknown error occurred",
    });
  }
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
