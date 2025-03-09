import { Router } from "express";
import { supabase } from "../config/supabase";

const router = Router();

// Get all articles
router.get("/", async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error: any) {
    console.error("Error fetching articles:", error);
    next(error);
  }
});

// Get single article
router.get("/:id", async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json(data);
  } catch (error: any) {
    console.error("Error fetching article:", error);
    next(error);
  }
});

// Create article
router.post("/", async (req, res, next) => {
  try {
    const { title, content, image_url, category_id } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: "Title and content are required",
      });
    }

    console.log("Attempting to create article:", {
      title,
      content,
      image_url,
      category_id,
    });

    const { data, error } = await supabase
      .from("articles")
      .insert([{ title, content, image_url, category_id }])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    res.status(201).json(data);
  } catch (error: any) {
    console.error("Error creating article:", error);
    next(error);
  }
});

export default router;
