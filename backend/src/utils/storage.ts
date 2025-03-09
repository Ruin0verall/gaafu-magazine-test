import { db } from "../db";
import type { Request } from "express";

// Generate a unique filename with timestamp
const generateUniqueFileName = (originalName: string) => {
  const timestamp = new Date().getTime();
  const extension = originalName.split(".").pop();
  return `${timestamp}-${Math.random()
    .toString(36)
    .substring(2, 15)}.${extension}`;
};

export const uploadImage = async (
  file: Express.Multer.File,
  bucket: string = "article-images"
): Promise<string> => {
  try {
    const fileName = generateUniqueFileName(file.originalname);

    const { data, error } = await db.storage
      .from(bucket)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    // Get the public URL for the uploaded file
    const {
      data: { publicUrl },
    } = db.storage.from(bucket).getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
};
