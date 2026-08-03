import { supabase } from './supabase';

const BUCKET_NAME = 'portfolio';
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  'image/svg+xml',
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/avif',
  'image/x-icon',
  'image/vnd.microsoft.icon'
]);
const ALLOWED_EXTENSIONS = new Set(['svg', 'png', 'jpg', 'jpeg', 'webp', 'ico', 'avif']);

function getFileExtension(fileName: string) {
  return fileName.split('.').pop()?.toLowerCase() ?? '';
}

export function validateUploadFile(file: File) {
  const fileExt = getFileExtension(file.name);
  const mimeType = file.type?.toLowerCase() || '';
  const isAllowedExtension = ALLOWED_EXTENSIONS.has(fileExt);
  const isAllowedMime = ALLOWED_MIME_TYPES.has(mimeType);

  if (!isAllowedExtension || !isAllowedMime) {
    throw new Error('Unsupported file type. Please upload SVG, PNG, JPG, JPEG, WEBP, ICO, or AVIF files.');
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('File is too large. Please upload an image smaller than 5 MB.');
  }

  return true;
}

export async function uploadFile(path: string, file: File) {
  validateUploadFile(file);

  const fileExt = getFileExtension(file.name);
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${path}/${fileName}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || undefined,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function deleteFile(url: string) {
  // Extract path from public URL
  // Example URL: https://xyz.supabase.co/storage/v1/object/public/portfolio/folder/file.jpg
  const pathParts = url.split(`/public/${BUCKET_NAME}/`);
  if (pathParts.length < 2) return;

  const filePath = pathParts[1];
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) throw error;
}
