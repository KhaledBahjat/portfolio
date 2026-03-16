import { Message } from '@/types';
import { getCollection, addDocument, updateDocument, deleteDocument } from '@/lib/supabase/database';

const TABLE = 'messages';

export const getMessages = async (): Promise<Message[]> => {
  const data = await getCollection(TABLE, { order: { column: 'created_at', ascending: false } });
  return data.map((item: any) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    message: item.message,
    read: item.is_read,
    createdAt: item.created_at
  }));
};

export const submitMessage = async (data: Omit<Message, 'id' | 'read' | 'createdAt'>): Promise<string> => {
  const supabaseData = {
    name: data.name,
    email: data.email,
    message: data.message,
    is_read: false
  };
  const result = await addDocument(TABLE, supabaseData);
  return result.id;
};

export const markAsRead = (id: string): Promise<void> =>
  updateDocument(TABLE, id, { is_read: true });

export const deleteMessage = (id: string): Promise<void> =>
  deleteDocument(TABLE, id);
