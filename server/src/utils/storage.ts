// server/src/utils/storage.ts - Supabase Storage utilities for file uploads
import { supabase, supabaseAdmin } from '../supabase';
import { v4 as uuidv4 } from 'uuid';

// Storage bucket names
export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  POST_IMAGES: 'post-images',
  DOCUMENTS: 'documents',
  ATTACHMENTS: 'attachments'
};

/**
 * Upload a file to Supabase Storage
 * @param bucket - The storage bucket name
 * @param file - File buffer or Blob
 * @param fileName - Original file name
 * @param userId - User ID for organizing files
 * @returns Public URL of the uploaded file
 */
export async function uploadFile(
  bucket: string,
  file: Buffer | Blob,
  fileName: string,
  userId?: number
): Promise<{ url: string; path: string }> {
  try {
    // Generate unique file path
    const fileExt = fileName.split('.').pop();
    const uniqueFileName = `${uuidv4()}.${fileExt}`;
    const filePath = userId 
      ? `${userId}/${uniqueFileName}` 
      : uniqueFileName;

    // Upload file to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, file, {
        contentType: getContentType(fileName),
        upsert: false
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      url: publicUrl,
      path: filePath
    };
  } catch (error: any) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

/**
 * Delete a file from Supabase Storage
 * @param bucket - The storage bucket name
 * @param filePath - Path to the file in storage
 */
export async function deleteFile(bucket: string, filePath: string): Promise<void> {
  try {
    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  } catch (error: any) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

/**
 * Get a signed URL for private files
 * @param bucket - The storage bucket name
 * @param filePath - Path to the file in storage
 * @param expiresIn - Expiration time in seconds (default: 1 hour)
 */
export async function getSignedUrl(
  bucket: string,
  filePath: string,
  expiresIn: number = 3600
): Promise<string> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      throw new Error(`Failed to create signed URL: ${error.message}`);
    }

    return data.signedUrl;
  } catch (error: any) {
    console.error('Error creating signed URL:', error);
    throw error;
  }
}

/**
 * Upload avatar image
 * @param file - File buffer
 * @param fileName - Original file name
 * @param userId - User ID
 */
export async function uploadAvatar(
  file: Buffer,
  fileName: string,
  userId: number
): Promise<string> {
  const { url } = await uploadFile(STORAGE_BUCKETS.AVATARS, file, fileName, userId);
  return url;
}

/**
 * Upload post image
 * @param file - File buffer
 * @param fileName - Original file name
 * @param userId - User ID
 */
export async function uploadPostImage(
  file: Buffer,
  fileName: string,
  userId: number
): Promise<string> {
  const { url } = await uploadFile(STORAGE_BUCKETS.POST_IMAGES, file, fileName, userId);
  return url;
}

/**
 * Upload document/attachment
 * @param file - File buffer
 * @param fileName - Original file name
 * @param userId - User ID
 */
export async function uploadDocument(
  file: Buffer,
  fileName: string,
  userId: number
): Promise<string> {
  const { url } = await uploadFile(STORAGE_BUCKETS.DOCUMENTS, file, fileName, userId);
  return url;
}

/**
 * Delete avatar image
 * @param avatarUrl - Full URL of the avatar
 */
export async function deleteAvatar(avatarUrl: string): Promise<void> {
  const filePath = extractFilePathFromUrl(avatarUrl);
  if (filePath) {
    await deleteFile(STORAGE_BUCKETS.AVATARS, filePath);
  }
}

/**
 * Delete post image
 * @param imageUrl - Full URL of the image
 */
export async function deletePostImage(imageUrl: string): Promise<void> {
  const filePath = extractFilePathFromUrl(imageUrl);
  if (filePath) {
    await deleteFile(STORAGE_BUCKETS.POST_IMAGES, filePath);
  }
}

/**
 * Extract file path from Supabase URL
 * @param url - Full Supabase storage URL
 */
function extractFilePathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    // Remove /storage/v1/object/public/{bucket}/ to get the file path
    const bucketIndex = pathParts.indexOf('public');
    if (bucketIndex !== -1 && bucketIndex + 2 < pathParts.length) {
      return pathParts.slice(bucketIndex + 2).join('/');
    }
    return null;
  } catch (error) {
    console.error('Error extracting file path from URL:', error);
    return null;
  }
}

/**
 * Get content type based on file extension
 * @param fileName - File name with extension
 */
function getContentType(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  
  const contentTypes: { [key: string]: string } = {
    // Images
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    
    // Documents
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    
    // Text
    'txt': 'text/plain',
    'csv': 'text/csv',
    
    // Archives
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed',
    
    // Video
    'mp4': 'video/mp4',
    'avi': 'video/x-msvideo',
    'mov': 'video/quicktime',
    
    // Audio
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav'
  };
  
  return contentTypes[ext || ''] || 'application/octet-stream';
}

/**
 * Validate file size
 * @param fileSize - File size in bytes
 * @param maxSize - Maximum allowed size in bytes (default: 5MB)
 */
export function validateFileSize(fileSize: number, maxSize: number = 5 * 1024 * 1024): boolean {
  return fileSize <= maxSize;
}

/**
 * Validate file type
 * @param fileName - File name with extension
 * @param allowedTypes - Array of allowed file extensions
 */
export function validateFileType(fileName: string, allowedTypes: string[]): boolean {
  const ext = fileName.split('.').pop()?.toLowerCase();
  return ext ? allowedTypes.includes(ext) : false;
}

// Common file type validators
export const IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
export const DOCUMENT_TYPES = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];
export const VIDEO_TYPES = ['mp4', 'avi', 'mov'];

export default {
  uploadFile,
  deleteFile,
  getSignedUrl,
  uploadAvatar,
  uploadPostImage,
  uploadDocument,
  deleteAvatar,
  deletePostImage,
  validateFileSize,
  validateFileType,
  STORAGE_BUCKETS,
  IMAGE_TYPES,
  DOCUMENT_TYPES,
  VIDEO_TYPES
};
