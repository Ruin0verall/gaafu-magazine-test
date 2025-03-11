import express from "express";
import { db } from "../db";
import { upload } from "../middleware/upload";
import { uploadFile } from "../utils/storage";

const router = express.Router();

// Middleware to handle authentication
const requireAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header' });
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await db.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Add user and token to request object
    (req as any).user = user;
    (req as any).token = token;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

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
router.post("/", requireAuth, upload.single("image"), async (req, res) => {
  try {
    console.log('Received article creation request');
    console.log('Request body:', req.body);
    console.log('File:', req.file);
    console.log('User:', (req as any).user);

    let imageUrl = null;

    // Upload image if provided
    if (req.file) {
      console.log('Processing image upload...');
      try {
        const uploadResult = await uploadFile(req.file.buffer, req.file.originalname);
        imageUrl = uploadResult.url;
        console.log('Image uploaded successfully:', imageUrl);
      } catch (uploadError: any) {
        console.error('Image upload failed:', uploadError);
        return res.status(500).json({ error: "Failed to upload image", details: uploadError.message });
      }
    }

    const { title, content, excerpt, category_id } = req.body;

    // Validate required fields
    if (!title || !content || !category_id) {
      console.error('Missing required fields:', { title, content, category_id });
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create article data object
    const articleData = {
      title,
      content,
      category_id,
      image_url: imageUrl,
      created_at: new Date().toISOString(),
    };

    // Add excerpt if provided
    if (excerpt) {
      Object.assign(articleData, { excerpt });
    }

    console.log('Creating article with data:', articleData);

    const { data: article, error } = await db
      .from("articles")
      .insert(articleData)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ 
        error: "Failed to create article", 
        details: error.message,
        code: error.code 
      });
    }

    if (!article) {
      console.error('No article returned after creation');
      return res.status(500).json({ error: "Article creation failed - no data returned" });
    }

    console.log('Article created successfully:', article);
    res.status(201).json(article);
  } catch (error: any) {
    console.error("Error creating article:", error);
    res.status(500).json({ 
      error: "Failed to create article",
      details: error.message,
      stack: error.stack
    });
  }
});

// Update article
router.put("/:id", requireAuth, upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const updates: any = { ...req.body };

    // Upload new image if provided
    if (req.file) {
      try {
        const uploadResult = await uploadFile(req.file.buffer, req.file.originalname);
        updates.image_url = uploadResult.url;
      } catch (uploadError: any) {
        console.error('Image upload failed:', uploadError);
        return res.status(500).json({ error: "Failed to upload image", details: uploadError.message });
      }
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
  } catch (error: any) {
    console.error("Error updating article:", error);
    res.status(500).json({ 
      error: "Failed to update article",
      details: error.message
    });
  }
});

// Delete article
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await db.from("articles").delete().eq("id", id);

    if (error) throw error;

    res.json({ message: "Article deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting article:", error);
    res.status(500).json({ 
      error: "Failed to delete article",
      details: error.message
    });
  }
});

export default router;
