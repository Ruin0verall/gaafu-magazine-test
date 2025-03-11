/**
 * File upload middleware configuration
 * Uses multer for handling multipart/form-data
 */

import multer from 'multer';
import path from 'path';

/**
 * Multer configuration for file uploads
 */
const storage = multer.memoryStorage();

/**
 * File filter configuration
 * Validates file types before upload
 */
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  // Allowed file types
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'));
  }
};

/**
 * Multer upload configuration
 * Limits file size and applies filters
 */
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});
