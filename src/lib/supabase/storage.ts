import { supabase } from './supabase';

const BUCKET_NAME = 'portfolio';

export async function uploadFile(path: string, file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${path}/${fileName}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file);

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
