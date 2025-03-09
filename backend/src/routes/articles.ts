import express from "express";
import { db } from "../db";
import { upload } from "../middleware/upload";
import { uploadImage } from "../utils/storage";

const router = express.Router();

// Get all articles
router.get("/", async (req, res, next) => {
  try {
    const { data, error } = await db
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
    const { id } = req.params;

    const { data: article, error } = await db
      .from("articles")
      .select(
        `
        *,
        categories (
          name
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json(article);
  } catch (error: any) {
    console.error("Error fetching article:", error);
    next(error);
  }
});

// Create article
router.post("/", upload.single("image"), async (req, res) => {
  try {
    let imageUrl = null;

    // Upload image if provided
    if (req.file) {
      imageUrl = await uploadImage(req.file);
    }

    const { title, content, excerpt, category_id, author } = req.body;

    const { data: article, error } = await db
      .from("articles")
      .insert({
        title,
        content,
        excerpt,
        category_id,
        author,
        image_url: imageUrl,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(article);
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ error: "Failed to create article" });
  }
});

// Update article
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const updates: any = { ...req.body };

    // Upload new image if provided
    if (req.file) {
      updates.image_url = await uploadImage(req.file);
    }

    const { data: article, error } = await db
      .from("articles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.json(article);
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ error: "Failed to update article" });
  }
});

// Delete article
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await db.from("articles").delete().eq("id", id);

    if (error) throw error;

    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ error: "Failed to delete article" });
  }
});

export default router;
