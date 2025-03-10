import { db } from "../db";
import type { Request } from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

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
  bucket: string = "article-images",
  accessToken?: string
): Promise<string> => {
  try {
    console.log('Starting image upload process...');
    console.log('File details:', {
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      bucket: bucket
    });

    // Create a new Supabase client with the access token
    const client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
        global: {
          headers: accessToken ? {
            Authorization: `Bearer ${accessToken}`
          } : undefined
        },
      }
    );

    // Verify authentication
    const { data: { user }, error: authError } = await client.auth.getUser(accessToken);
    if (authError || !user) {
      console.error('Authentication error:', authError);
      throw new Error('Authentication failed');
    }
    console.log('Authentication successful. User:', user.email);

    const fileName = generateUniqueFileName(file.originalname);
    console.log('Generated filename:', fileName);

    console.log('Attempting to upload file to bucket:', bucket);
    const { data, error } = await client.storage
      .from(bucket)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error('Supabase storage error:', error);
      throw error;
    }

    console.log('File uploaded successfully:', data);

    // Get the public URL for the uploaded file
    const {
      data: { publicUrl },
    } = client.storage.from(bucket).getPublicUrl(fileName);

    console.log('Generated public URL:', publicUrl);
    return publicUrl;
  } catch (err: any) {
    console.error("Error uploading image:", err);
    if (err.error?.message) {
      console.error("Supabase error message:", err.error.message);
    }
    if (err.message) {
      console.error("Error message:", err.message);
    }
    throw new Error("Failed to upload image");
  }
};
