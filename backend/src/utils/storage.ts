/**
 * Storage utility functions for handling file uploads to Supabase Storage
 */

import { supabase } from '../config/supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * Storage bucket configuration
 */
const STORAGE_BUCKET = 'article-images';
const PUBLIC_URL_EXPIRY = 365 * 24 * 60 * 60; // 1 year in seconds

/**
 * Interface for upload response
 */
interface UploadResponse {
  url: string;
  path: string;
}

/**
 * Uploads a file to Supabase storage
 * @param file - File buffer to upload
 * @param originalName - Original filename
 * @returns Promise with the upload response
 * @throws Error if upload fails
 */
export const uploadFile = async (
  file: Buffer,
  originalName: string
): Promise<UploadResponse> => {
  try {
    // Generate unique filename
    const fileExt = originalName.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        contentType: `image/${fileExt}`,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Failed to upload file: ${uploadError.message}`);
    }

    // Get public URL for the uploaded file
    const { data: urlData } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(filePath, PUBLIC_URL_EXPIRY);

    if (!urlData?.signedUrl) {
      throw new Error('Failed to generate signed URL for uploaded file');
    }

    return {
      url: urlData.signedUrl,
      path: filePath
    };
  } catch (error) {
    console.error('Error in uploadFile:', error);
    throw error;
  }
};

/**
 * Deletes a file from Supabase storage
 * @param filePath - Path of the file to delete
 * @throws Error if deletion fails
 */
export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    const { error: deleteError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath]);

    if (deleteError) {
      throw new Error(`Failed to delete file: ${deleteError.message}`);
    }
  } catch (error) {
    console.error('Error in deleteFile:', error);
    throw error;
  }
};
