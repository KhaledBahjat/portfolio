import { Skill } from '@/types';
import { getCollection, addDocument, updateDocument, deleteDocument } from '@/lib/supabase/database';

const TABLE = 'skills';

export const getSkills = async (): Promise<Skill[]> => {
  const data = await getCollection(TABLE, { order: { column: 'category', ascending: true } });
  return data.map((item: any) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    icon: item.icon,
    createdAt: item.created_at
  }));
};

export const addSkill = async (data: Omit<Skill, 'id'>): Promise<string> => {
  const result = await addDocument(TABLE, data);
  return result.id;
};

export const updateSkill = (id: string, data: Partial<Skill>): Promise<void> =>
  updateDocument(TABLE, id, data);

export const deleteSkill = (id: string): Promise<void> =>
  deleteDocument(TABLE, id);
