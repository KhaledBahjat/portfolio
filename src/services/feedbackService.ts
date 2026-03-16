import { Feedback } from '@/types';
import { getCollection, addDocument, updateDocument, deleteDocument } from '@/lib/supabase/database';
import { uploadFile, deleteFile } from '@/lib/supabase/storage';

const TABLE = 'feedback';

export const getFeedback = async (): Promise<Feedback[]> => {
  const data = await getCollection(TABLE, { order: { column: 'created_at', ascending: false } });
  return data.map((item: any) => ({
    id: item.id,
    image: item.image,
    name: item.name,
    role: item.role,
    createdAt: item.created_at
  }));
};

export const addFeedback = async (data: Omit<Feedback, 'id'>): Promise<string> => {
  const supabaseData = {
    image: data.image,
    name: data.name,
    role: data.role
  };
  const result = await addDocument(TABLE, supabaseData);
  return result.id;
};

export const updateFeedback = async (id: string, data: Partial<Feedback>): Promise<void> => {
  const supabaseData: any = {};
  if (data.image !== undefined) supabaseData.image = data.image;
  if (data.name !== undefined) supabaseData.name = data.name;
  if (data.role !== undefined) supabaseData.role = data.role;

  await updateDocument(TABLE, id, supabaseData);
};

export const deleteFeedback = (id: string): Promise<void> =>
  deleteDocument(TABLE, id);

export const uploadFeedbackImage = (id: string, file: File): Promise<string> =>
  uploadFile(`feedback/${id}`, file);

export const removeFeedbackImage = (url: string): Promise<void> =>
  deleteFile(url);
